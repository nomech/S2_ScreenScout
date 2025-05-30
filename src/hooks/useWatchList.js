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

    const removeFromWatchList = async (uid, mediaId, mediaType) => {
        const currentData = await getWatchList(uid);

        if (currentData[mediaType].includes(mediaId)) {
            try {
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

    const markAsWatched = async (uid, mediaId) => {
        try {
            const docRef = doc(db, "watchlists", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const currentData = docSnap.data();
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
                console.log(error);
            }
        }
    };

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
