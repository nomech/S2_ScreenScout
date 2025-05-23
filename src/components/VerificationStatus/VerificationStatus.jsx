import { useState, useContext } from "react";
import { authContext } from "../../context/authContext";
import { sendEmailVerification } from "firebase/auth";
import Button from "../Button/Button";
import styles from "./VerificationStatus.module.css";

const VerificationStatus = () => {
    const { user, verified } = useContext(authContext);
    const [status, setStatus] = useState("");
    const [hasSent, setHasSent] = useState(false);

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
