import styles from "./LoginCard.module.css";
import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { formatFireBaseFeedback } from "../../utils/fromatFirebaseErrors";
import { signInValidation } from "../../utils/formValidation";
import InfoCard from "../InfoCard/InfoCard";

// Component for user login functionality
const LoginCard = () => {
    // State to manage form data, loading state, and error messages
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handler for input changes to update form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Function to handle form submission for user login
    const onSubmit = async (e) => {
        e.preventDefault();

        // Destructure email and password from formData
        const { email, password } = formData;

        // Validate the form data before proceeding with login
        if (!signInValidation(formData, setError)) {
            return;
        }

        // Attempt to sign in with email and password
        try {
            setError(null);
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);

            // If successful, navigate to the home page
            navigate("/");
        } catch (error) {
            // If an error occurs, format the error message and set it in state
            formatFireBaseFeedback(error.code, setError);
        } finally {
            // Reset loading state regardless of success or failure
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.loginCard} onSubmit={(e) => onSubmit(e)}>
            <h1 className={styles.title}> ScreenScout</h1>
            <div className={styles.inputContainer}>
                {/* Input fields for email and password with labels and error handling */}
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    className="email"
                    onChange={handleChange}
                    name="email"
                    id="email"
                    type="email"
                    value={formData.email}
                    autoComplete="username"
                    error={error}
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    className="password"
                    onChange={handleChange}
                    name="password"
                    id="password"
                    type="password"
                    value={formData.password}
                    autoComplete="current-password"
                    error={error}
                />
            </div>

            {/* Display error messages if any */}
            {error && error.firebase && (
                <InfoCard style="error" text={error.firebase} />
            )}

            {/* Links to create an account or reset password */}
            <div className={styles.linkContainer}>
                <NavLink to="/signup" className={styles.link}>
                    Create Account
                </NavLink>

                <NavLink to="/forgot-password" className={styles.link}>
                    Forgot password?
                </NavLink>
            </div>

            {/* Submit button for signing in */}
            <Button ariaLabel="Login button" className="login" type="submit">
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
};

export default LoginCard;
