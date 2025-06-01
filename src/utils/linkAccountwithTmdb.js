import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Set Options for Fetch Requests to TMDB
const controller = new AbortController();
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
    },
    signal: controller.signal,
};

// Function to get a new request token from TMDB API
const getRequestToken = async () => {
    // URL to fetch a new request token
    const newRequestToken =
        "https://api.themoviedb.org/3/authentication/token/new";
    try {
        // Fetch the request token from TMDB API
        const response = await fetch(newRequestToken, options);

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error("Failed to fetch request token from TMDB API");
        }

        // Parse the response JSON to get the request token
        const token = await response.json();

        //Return the request token
        return token.request_token;
    } catch (error) {
        console.error("An error occured:" + error);
    }
};

// Function to authenticate with TMDB and redirect to the authentication page
export const authenticateWithTmdb = async () => {
    const authenticationUrl = "https://www.themoviedb.org/authenticate";
    const token = await getRequestToken();
    const redirectUrl = `${authenticationUrl}/${token}?redirect_to=${window.location.origin}/settings`;

    window.location.href = redirectUrl;
};

export const getAndSetSessionToken = async (requestToken, uid) => {
    // URL to create a new session with the request token
    const sessionUrl = `https://api.themoviedb.org/3/authentication/session/new`;

    // Options for the POST request to create a new session
    const postOptions = {
        ...options,
        method: "POST",
        body: JSON.stringify({
            request_token: requestToken,
        }),
    };
    try {
        // Fetch the session token from TMDB API
        const response = await fetch(sessionUrl, postOptions);
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error("Failed to fetch session token from TMDB API");
        }
        // Parse the response JSON to get the session ID
        const data = await response.json();

        // Check if the session ID is present in the response
        const sessionId = data.session_id;

        try {
            // Store the session ID in Firestore under the user's watchlist document
            const docRef = doc(db, "watchlists", uid);

            // Use setDoc to merge the sessionId into the existing document
            await setDoc(docRef, { sessionId }, { merge: true });
        } catch (error) {
            console.error("Error setting session id:", error);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkSessionId = async (uid) => {
    try {
        const docRef = doc(db, "watchlists", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().sessionId) {
            return docSnap.data().sessionId;
        } else {
            console.log("No session ID found for user:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error checking session ID:", error);
    }
};

export const deleteSessionId = async (uid) => {
    const sessionUrl = "https://api.themoviedb.org/3/authentication/session";
    const sessionId = await checkSessionId(uid);

    const deleteOptions = {
        ...options,
        method: "DELETE",
        body: JSON.stringify({
            session_id: sessionId,
        }),
    };
    try {
        // Fetch the session token from TMDB API
        const response = await fetch(sessionUrl, deleteOptions);
        const data = await response.json();
        // Check if the session ID was successfully deleted
        if (data.success) {
            try {
                // Fetch the user's watchlist document from Firestore
                const docRef = doc(db, "watchlists", uid);
                const docSnap = await getDoc(docRef);

                // Check if the document exists and has a sessionId field
                if (docSnap.exists() && docSnap.data().sessionId) {
                    await setDoc(docRef, { sessionId: null }, { merge: true });
                } else {
                    console.log("No session ID found for user:", uid);
                }
            } catch (error) {
                console.error("Error deleting session ID:", error);
            }
            console.log("Session ID deleted successfully:", data);
        }
    } catch (error) {
        console.error("Error deleting session ID:", error);
    }
};
