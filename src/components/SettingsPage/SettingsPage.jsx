import VerificationStatus from "../VerificationStatus/VerificationStatus";
import UserInformation from "../UserInformation/UserInformation";
import Button from "../Button/Button";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
    authenticateWithTmdb,
    getAndSetSessionToken,
    checkSessionId,
    deleteSessionId,
} from "../../utils/linkAccountwithTmdb";

// this component is used to render the settings page
const SettingsPage = () => {
    const [linked, setLinked] = useState(null);

    // Context to access user authentication
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const checkSession = async () => {
            const sessionId = await checkSessionId(user.uid);
            if (sessionId) {
                setLinked(true);
                console.log("Session ID found:", sessionId);
            } else {
                setLinked(false);
                console.log("No session ID found for user:", user.uid);
            }
        };

        if (!user) {
            return;
        }
        checkSession();

        // Check if the user is authenticated and has a request token
        const params = new URLSearchParams(window.location.search);
        const approved = params.get("approved");
        const request_token = params.get("request_token");

        // If the user is approved and has a request token, get and set the session token
        if (approved && request_token) {
            getAndSetSessionToken(request_token, user.uid);
        }
    }, [user]);

    const removeSessionId = async () => {
        // Function to remove the session ID from the user's watchlist
        if (user) {
            await deleteSessionId(user.uid);
            setLinked(false);
        }
    };
    return (
        <>
            {/* The VerificationStatus component displays the user's verification status */}
            <VerificationStatus />
            <UserInformation />
            {linked && (
                <Button onClick={removeSessionId}>
                    Unlink Account from TMDB
                </Button>
            )}
            {/* Button to link the account with TMDB */}
            {!linked && (
                <Button onClick={authenticateWithTmdb}>
                    Link Account with TMDB
                </Button>
            )}
        </>
    );
};

export default SettingsPage;
