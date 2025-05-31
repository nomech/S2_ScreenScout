import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

//This context provides authentication state and methods for user sign-out in the application.
const AuthContext = createContext();

// This component wraps the application and provides authentication state and methods to its children.
export const AuthProvider = ({ children }) => {
    // State variables to manage user authentication status, loading state, and email verification status
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [verified, setVerified] = useState(null);
    const [error, setError] = useState(null);

    // Effect to listen for authentication state changes and update user state accordingly
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // If a user is signed in, set the user state and email verification status
            if (user) {
                setUser(user);
                setVerified(user.emailVerified);
            } else {
                // If no user is signed in, reset user state and verification status
                setUser(null);
            }
            // Set loading state to false after checking authentication status
            setIsLoading(false);
        });
        // Cleanup function to unsubscribe from the authentication state listener
        return unsubscribe;
    }, []);

    // Function to sign out the user and reset user state
    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            setError(error);
            throw new Error("Failed to sign out user: " + error.message);
        }
    };

    // authContext provides user information, loading state, sign-out function, email verification status, and any errors encountered
    return (
        <AuthContext.Provider
            value={{ user, isLoading, signOutUser, verified, error }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
