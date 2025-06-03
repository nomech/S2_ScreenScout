import styles from "./SettingsPage.module.css";
import VerificationStatus from "../VerificationStatus/VerificationStatus";
import UserInformation from "../UserInformation/UserInformation";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { getAuthContext } from "../../context/authContext";
import {
    authenticateWithTmdb,
    getAndSetSessionToken,
    checkSessionId,
    deleteSessionId,
} from "../../utils/linkAccountwithTmdb";
import InfoCard from "../InfoCard/InfoCard";

// this component is used to render the settings page
const SettingsPage = () => {
    const [linked, setLinked] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [feedbackSuccess, setFeedbackSuccess] = useState(null);

    // Context to access user authentication
    const { user } = getAuthContext();

    useEffect(() => {
        const checkSession = async () => {
            const sessionId = await checkSessionId(user.uid);
            if (sessionId) {
                setLinked(true);
            } else {
                setLinked(false);
            }
        };

        const linkAccount = async () => {
            const results = await getAndSetSessionToken(
                request_token,
                user.uid
            );
            if (results.success) {
                setLinked(true);
                setFeedback(results.message || "Account linked successfully.");
                setFeedbackSuccess(true);
            } else {
                setLinked(false);
                setFeedback(results.message || "Failed to link account.");
                setFeedbackSuccess(false);
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
            linkAccount();
        }
    }, [user]);

    const removeSessionId = async () => {
        // Function to remove the session ID from the user's watchlist
        if (user) {
            const result = await deleteSessionId(user.uid);
            setLinked(false);
            setFeedback(result.message || "Failed to unlink account.");
            setFeedbackSuccess(result.success);
        }
    };

    const linkWithTmdb = async () => {
        // Function to link the account with TMDB
        if (user) {
            const result = await authenticateWithTmdb();
            console.log(result);

            setFeedback(result.message || "Failed to link account.");
            setFeedbackSuccess(result.success);
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
                <Button onClick={linkWithTmdb}>Link Account with TMDB</Button>
            )}
            {feedbackSuccess && (
                <div className={styles.feedbackContainer}>
                    <InfoCard
                        text={feedback}
                        style={feedbackSuccess ? "success" : "error"}
                    />
                </div>
            )}
        </>
    );
};

export default SettingsPage;
