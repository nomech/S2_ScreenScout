import React, { useEffect } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./SignupCard.module.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { signupFormValidation } from "../../utils/formValidation";
import placeholder from "../../assets/images/placeholder.png";

const SignupCard = () => {
    const apiName = import.meta.env.VITE_CLOUDINARY_NAME;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        previewUrl: `${placeholder}`,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let timer;
        if (success) {
            timer = setTimeout(() => navigate("/login"), 3000);
        }
        return () => clearTimeout(timer);
    }, [success, navigate]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (!signupFormValidation(formData, setError)) {
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            const imageUrl = await handleFileUpload();

            setSuccess(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                previewUrl: "",
            });

            await updateProfile(user, {
                displayName: formData.name,
                photoURL: imageUrl,
            });

            console.log("User profile updated:", user);

            navigate("/");
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prevData) => ({
                ...prevData,
                image: file,
                previewUrl: previewUrl,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                previewUrl: `placeholder`,
            }));
            setError("Please select a valid image file.");
        }
    };

    const handleFileUpload = async () => {
        try {
            const form = new FormData();
            form.append("file", formData.image);
            form.append("upload_preset", "upload_preset_screenscout");
            form.append("cloud_name", apiName);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${apiName}/upload`,
                {
                    method: "POST",
                    body: form,
                }
            );
            const data = await response.json();
            setFormData((prev) => ({
                ...prev,
                previewUrl: data.secure_url,
            }));

            return data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
            return null;
        }
    };

    return (
        <form className={styles.signupCard} onSubmit={(e) => handleSignUp(e)}>
            <h1 className={styles.title}> ScreenScout</h1>
            <div className={styles.inputContainer}>
                <div class={styles.profileContainer}>
                    <div className={styles.profilePicture}>
                        <img
                            src={formData.previewUrl}
                            alt="Preview of profile picture"
                        />
                    </div>
                    <Input
                        label="Add profile picture +"
                        className="file-uploader"
                        type="file"
                        onChange={handleFileChange}
                        id="upload"
                        name="upload"
                        error={error}
                    />
                </div>
                <Input
                    label="First name"
                    placeholder="Enter your first name"
                    className="firstName"
                    type="text"
                    value={formData.name}
                    onChange={handleOnChange}
                    id="firstName"
                    name="firstName"
                    error={error}
                />
                <Input
                    label="Last name"
                    placeholder="Enter your last name"
                    className="name"
                    type="text"
                    value={formData.name}
                    onChange={handleOnChange}
                    id="lastName"
                    name="lastName"
                    error={error}
                />
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    className="email"
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
                    className="password"
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
                    className="confirmPassword"
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
