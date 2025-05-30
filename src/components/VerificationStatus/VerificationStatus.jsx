import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import Button from "../Button/Button";
import styles from "./VerificationStatus.module.css";

// This component displays the email verification status of a user and provides a button to resend the verification email if needed.
const VerificationStatus = () => {
    // State to manage the verification status and whether the email has been sent
    const [status, setStatus] = useState("");
    const [hasSent, setHasSent] = useState(false);

    // Context to access user authentication information
    const { user, verified } = useContext(AuthContext);

    // Function to handle sending the verification email
    const onHandleVerification = async () => {
        try {
            await sendEmailVerification(user);
            setStatus("Verification email sent! Check your inbox.");
            setHasSent(true);
        } catch (error) {
            console.error("Email verification error:", error);
            setStatus(
                "Failed to send verification email. Please try again later."
            );
        }
    };

    return (
        <div className={styles.verificationStatus}>
            {verified ? (
                <p>Your email has been verified.</p>
            ) : (
                <>
                    <div className={styles.verificationMessage}>
                        <p>Your email is not verified:</p>
                        <Button
                            onClick={onHandleVerification}
                            className="verify"
                            disabled={hasSent}
                        >
                            Verify
                        </Button>
                    </div>
                    <div>{status && <p>{status}</p>}</div>
                </>
            )}
        </div>
    );
};

export default VerificationStatus;
