import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [verified, setVerified] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user);
                setUser(user);
                setVerified(user.emailVerified);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <authContext.Provider
            value={{ user, isLoading, signOutUser, verified }}
        >
            {children}
        </authContext.Provider>
    );
};
