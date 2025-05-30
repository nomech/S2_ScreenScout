import styles from "./ForgotPasswordCard.module.css";
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { forgotPasswordFormValidation } from "../../utils/formValidation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";

// This component provides a form for users to reset their password by entering their email address.
const ForgotPasswordCard = () => {
    // Hooks to manage state and side effects
    const navigate = useNavigate();
    const [email, setEmail] = useState({ email: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsloading] = useState(false);

    // Effect to clear error and success messages after a delay
    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => navigate("/login"), 3000);
        }
        return () => clearTimeout(timer);
    }, [success, navigate]);

    // Effect to clear error message after a delay
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setEmail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle form submission for password reset
    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate the email input before sending the reset link
        if (!forgotPasswordFormValidation(email, setError)) {
            return;
        }

        // Reset error and success messages

        try {
            setIsloading(true);
            // Attempt to send a password reset email
            await sendPasswordResetEmail(auth, email.email);

            // If successful, set success message and clear email input
            setSuccess(
                `A password reset link was sent to ${email.email} if it exists`
            );
            setEmail({ email: "" });
        } catch (error) {
            // If an error occurs, set the error message
            setError(error.message);
        } finally {
            // Reset loading state regardless of success or failure
            setIsloading(false);
        }
    };

    return (
        // Render the forgot password form
        <form
            className={styles.forgotPasswordCard}
            onSubmit={(e) => onSubmit(e)}
        >
            <h1 className={styles.title}> ScreenScout</h1>

            {/* Display error message if there is an error */}
            {!success && (
                <>
                    <div className={styles.inputContainer}>
                        {/*input for email address with validation*/}
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            className="email"
                            type="email"
                            value={email.email}
                            name={"email"}
                            id="email"
                            onChange={handleOnChange}
                            error={error}
                        />
                    </div>

                    {/* Links to create an account or sign in */}
                    <div className={styles.linkContainer}>
                        <NavLink to="/signup" className={styles.link}>
                            Create Account
                        </NavLink>

                        <NavLink to="/login" className={styles.link}>
                            Sign in
                        </NavLink>
                    </div>

                    <Button
                        ariaLabel="Reset button"
                        className="login"
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? "Sending link..." : "Reeset Password"}
                    </Button>
                </>
            )}

            {/* Display success message if the reset link was sent successfully */}

            {success && (
                <div className={styles.successMessage}>
                    <p>{success}</p>
                </div>
            )}
        </form>
    );
};

export default ForgotPasswordCard;
