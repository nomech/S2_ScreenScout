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

const LoginCard = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!signInValidation(formData, setError)) {
            return;
        }

        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            formatFireBaseFeedback(error.code, setError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.loginCard} onSubmit={(e) => onSubmit(e)}>
            <h1 className={styles.title}> ScreenScout</h1>
            <div className={styles.inputContainer}>
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

            {error && error.firebase && (
                <InfoCard style="error" text={error.firebase} />
            )}

            <div className={styles.linkContainer}>
                <NavLink to="/signup" className={styles.link}>
                    Create Account
                </NavLink>

                <NavLink to="/forgot-password" className={styles.link}>
                    Forgot password?
                </NavLink>
            </div>
            <Button ariaLabel="Login button" className="login" type="submit">
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    );
};

export default LoginCard;
