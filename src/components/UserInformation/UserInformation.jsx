import { useContext, useEffect, useState } from "react";
import {
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
} from "firebase/auth";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./UserInformation.module.css";
import AuthContext from "../../context/AuthContext";
import { formatFireBaseFeedback } from "../../utils/formatFirebaseErrors";
import { updateProfileValidation } from "../../utils/formValidation";
import InfoCard from "../InfoCard/InfoCard";
import { auth } from "../../firebaseConfig";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

// This component renders a user information form that allows users to update their profile details such as name, email, and profile picture. It also includes functionality for resetting the password.
const UserInformation = () => {
    // State to manage form data, readonly state, loading state, error messages, and success messages
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        photoURL: "",
    });

    const [readonly, setReadOnly] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Context to access user authentication information
    const { user } = useContext(AuthContext);

    // Cloudinary configuration for profile picture upload
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
    const uploadPreset = "upload_preset_screenscout";

    // Effect to initialize form data with user information when the component mounts or when the user changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.displayName?.split(" ")[0],
                lastName: user.displayName?.split(" ")[1],
                email: user.email,
                photoUrl: user.photoURL,
            });
        }
    }, [user]);

    // Function to handle the completion of profile picture upload
    const handleUploadComplete = (url) => {
        setFormData((prev) => ({ ...prev, photoUrl: url }));
        setIsLoading(false);
    };

    // Function to handle input changes in the form
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function to toggle the readonly state and handle profile updates
    const toggleReadOnly = async (e) => {
        e.preventDefault();

        // If the form is readonly, switch to edit mode; otherwise, validate and update the profile
        if (!readonly) {
            // Validate the form data before proceeding
            if (!updateProfileValidation(formData, setError)) {
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Update the user's profile with the new information
                await updateProfile(user, {
                    displayName: `${formData.firstName} ${formData.lastName}`,
                    photoURL: formData.photoUrl,
                });

                // If the email has changed, update it as well
                if (formData.email !== user.email) {
                    await updateEmail(user, formData.email);
                }
            } catch (error) {
                // Handle errors during profile update
                setReadOnly((prev) => !prev);
                // Format the Firebase error message and set it in the error state
                formatFireBaseFeedback(error.code, setError);
            } finally {
                // Reset loading state after the operation is complete
                setIsLoading(false);
            }
        }

        // Toggle the readonly state
        setReadOnly((prev) => !prev);
    };

    // Function to handle password reset
    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, user.email);
            setSuccess("Password reset email sent successfully.");
        } catch (error) {
            setError("Failed to send password reset email.");
            throw new Error(error);
        }
    };

    return (
        <>
            {user && (
                <div className={styles.UserInformation}>
                    <form
                        onSubmit={toggleReadOnly}
                        className={styles.userInformationForm}
                    >
                        {/* Profile picture upload component with placeholder, cloudinary configuration, and error handling */}
                        <ProfilePicture
                            placeholder={user.photoURL}
                            cloudinaryName={cloudinaryName}
                            uploadPreset={uploadPreset}
                            onError={setError}
                            label="Update profile picture +"
                            readonly={readonly}
                            setIsLoading={setIsLoading}
                            isLoading={isLoading}
                            onUploadComplete={handleUploadComplete}
                        />

                        {/* Input fields for first name, last name, and email with error handling */}
                        <div className={styles.inputContainer}>
                            <Input
                                id="firstName"
                                name="firstName"
                                label="First name"
                                className="firstName"
                                value={formData.firstName}
                                readonly={readonly}
                                onChange={handleOnChange}
                                disabled={isLoading}
                                error={error}
                            />

                            <Input
                                id="lastName"
                                name="lastName"
                                className="lastName"
                                label="Last name"
                                value={formData.lastName}
                                readonly={readonly}
                                onChange={handleOnChange}
                                disabled={isLoading}
                                error={error}
                            />

                            <Input
                                id="email"
                                name="email"
                                className="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                readonly={readonly}
                                onChange={handleOnChange}
                                disabled={isLoading}
                                error={error}
                            />
                        </div>
                        <div className={styles.passwordReset}>
                            <p>
                                If you want to reset your password, please click
                                the button:
                            </p>
                            <Button
                                onClick={handlePasswordReset}
                                disabled={isLoading}
                                className="resetPassword"
                            >
                                Reset Password
                            </Button>
                        </div>
                        {success && <InfoCard style="success" text={success} />}

                        <Button
                            onClick={toggleReadOnly}
                            disabled={isLoading}
                            className="saveButton"
                        >
                            {readonly ? "Edit" : isLoading ? "Saving…" : "Save"}
                        </Button>
                    </form>

                    {/* Display error messages if any */}
                    {error && error.firebase && (
                        <InfoCard style="error" text={error.firebase} />
                    )}
                </div>
            )}
        </>
    );
};

export default UserInformation;
