import React, { useState, useContext } from "react";
import { authContext } from "../../context/authContext";
import { sendEmailVerification } from "firebase/auth";
import Button from "../Button/Button";

const VerificationStatus = () => {
    const { user, verified } = useContext(authContext);
    const [status, setStatus] = useState("");

    const onHandleVerification = async () => {
        try {
            await sendEmailVerification(user);
            setStatus("Verification email sent! Check your inbox.");
        } catch (error) {
            console.error("Email verification error:", error);
            setStatus(
                "Failed to send verification email. Please try again later."
            );
        }
    };

    return (
        <div className="wrapper">
            {verified ? (
                <p>Your email has been verified.</p>
            ) : (
                <div>
                    <p>Your email is not verified.</p>
                    <Button onClick={onHandleVerification}>Verify</Button>
                    {status && <p>{status}</p>}
                </div>
            )}
            <hr className="divider" />
        </div>
    );
};

export default VerificationStatus;
