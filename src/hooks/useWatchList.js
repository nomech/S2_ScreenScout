import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// This hook provides functionality to manage a user's watchlist, including creating, updating, and retrieving watchlists from Firestore.
export const useWatchList = () => {
    // Function to set a default watchlist for a user
    const setDefaultWatchList = async (uid) => {
        // Check if the watchlist document already exists for the user
        const docRef = doc(db, "watchlists", uid);
        const docSnap = await getDoc(docRef);

        // If the document exists, no need to create a new one
        if (docSnap.exists()) {
            return;
        }

        // If the document does not exist, create a new watchlist with empty arrays for movies, TV shows, and watched media
        try {
            const docRef = doc(db, "watchlists", uid);
            await setDoc(docRef, {
                movie: [],
                tv: [],
                watched: [],
            });
        } catch (error) {
            console.error("Error creating watchlist:", error);
        }
    };

    // Function to retrieve a user's watchlist from Firestore
    const getWatchList = async (uid) => {
        const docRef = doc(db, "watchlists", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.error("No such document!");
            return null;
        }
    };

    // Function to create or update a watchlist by adding a media item to the user's watchlist
    const createWatchList = async (uid, data) => {
        const currentData = await getWatchList(uid);

        if (!currentData[data.media_type].includes(data.id)) {
            try {
                const { media_type, id } = data;
                currentData[media_type].push(id);
                const docRef = doc(db, "watchlists", uid);
                await setDoc(docRef, currentData);
            } catch (error) {
                console.error("Error updating watchlist:", error);
            }
        }
    };

    // Function to remove a media item from the user's watchlist
    const removeFromWatchList = async (uid, mediaId, mediaType) => {
        // Retrieve the current watchlist data for the user
        const currentData = await getWatchList(uid);

        // Check if the mediaId exists in the specified mediaType array
        if (currentData[mediaType].includes(mediaId)) {
            try {
                // If it exists, filter it out from the array
                // and update the watchlist document in Firestore
                currentData[mediaType] = currentData[mediaType].filter(
                    (item) => item !== mediaId
                );
                const docRef = doc(db, "watchlists", uid);
                await setDoc(docRef, currentData);
            } catch (error) {
                console.error("Error remving from watchlist:", error);
            }
        }
    };

    // Function to mark a media item as watched by adding it to the watched array in the user's watchlist
    const markAsWatched = async (uid, mediaId) => {
        try {
            const docRef = doc(db, "watchlists", uid);
            const docSnap = await getDoc(docRef);
            // Check if the document exists
            if (docSnap.exists()) {
                // If it exists, retrieve the current data
                const currentData = docSnap.data();
                // Check if the mediaId is already in the watched array

                if (!currentData.watched.includes(mediaId)) {
                    currentData.watched.push(mediaId);
                    await setDoc(docRef, currentData);
                }
            } else {
                console.error("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error marking as watched:", error);
        }
    };

    // Function to retrieve the watched media items from the user's watchlist
    const getWatchedMedia = async (uid) => {
        const docRef = doc(db, "watchlists", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().watched;
        } else {
            console.error("No such document!");
            return null;
        }
    };

    // Function to remove a media item from the watched list
    const removeWatchedMedia = async (uid, mediaId) => {
        const currentData = await getWatchList(uid);
        if (currentData.watched.includes(mediaId)) {
            try {
                currentData.watched = currentData.watched.filter((media) => {
                    return media !== mediaId;
                });
                const docRef = doc(db, "watchlists", uid);
                await setDoc(docRef, currentData);
            } catch (error) {
                console.error("Error removing watched media:", error);
                
            }
        }
    };

    // Return the functions to be used in components
    return {
        setDefaultWatchList,
        createWatchList,
        getWatchList,
        removeFromWatchList,
        markAsWatched,
        getWatchedMedia,
        removeWatchedMedia,
    };
};
