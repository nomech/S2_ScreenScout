import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";

import Input from "../Input/Input";
import Button from "../Button/Button";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import styles from "./SignupCard.module.css";
import { auth } from "../../firebaseConfig";
import { signupFormValidation } from "../../utils/formValidation";
import placeholder from "../../assets/images/placeholder.png";

const SignupCard = () => {
    const navigate = useNavigate();
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
    const uploadPreset = "upload_preset_screenscout";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        photoUrl: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let timer;
        if (success) timer = setTimeout(() => navigate("/login"), 3000);
        return () => clearTimeout(timer);
    }, [success, navigate]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadComplete = (url) => {
        setFormData((prev) => ({ ...prev, photoUrl: url }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (!signupFormValidation(formData, setError)) return;

        setIsLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await updateProfile(user, {
                displayName: `${formData.firstName} ${formData.lastName}`,
                photoURL: formData.photoUrl,
            });

            await sendEmailVerification(user);
            setSuccess(true);

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                photoUrl: "",
            });

            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message || err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.signupCard} onSubmit={handleSignUp}>
            <h1 className={styles.title}>ScreenScout</h1>
            <div className={styles.inputContainer}>
                <ProfilePicture
                    placeholder={placeholder}
                    cloudinaryName={cloudinaryName}
                    uploadPreset={uploadPreset}
                    onUploadComplete={handleUploadComplete}
                    onError={setError}
                    label="Add a profile picture +"
                />

                <Input
                    label="First name"
                    placeholder="Enter your first name"
                    type="text"
                    value={formData.firstName}
                    onChange={handleOnChange}
                    id="firstName"
                    name="firstName"
                    error={error}
                />
                <Input
                    label="Last name"
                    placeholder="Enter your last name"
                    type="text"
                    value={formData.lastName}
                    onChange={handleOnChange}
                    id="lastName"
                    name="lastName"
                    error={error}
                />
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={handleOnChange}
                    id="email"
                    name="email"
                    error={error}
                />
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={formData.password}
                    onChange={handleOnChange}
                    id="password"
                    name="password"
                    error={error}
                />
                <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleOnChange}
                    id="confirmPassword"
                    name="confirmPassword"
                    error={error}
                />
            </div>

            <NavLink to="/login" className={styles.link}>
                Already have an account? Sign in
            </NavLink>

            <Button
                ariaLabel="Signup button"
                className="signup"
                disabled={isLoading}
                type="submit"
            >
                {isLoading ? "Creating..." : "Create Account"}
            </Button>
        </form>
    );
};

export default SignupCard;
