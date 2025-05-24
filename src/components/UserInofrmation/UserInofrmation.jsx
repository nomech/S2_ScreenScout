import { useContext, useEffect, useState } from "react";
import {
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
} from "firebase/auth";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./UserInformation.module.css";
import { authContext } from "../../context/authContext";
import { formatFireBaseFeedback } from "../../utils/fromatFirebaseErrors";
import { updateProfileValidation } from "../../utils/formValidation";
import InfoCard from "../InfoCard/InfoCard";
import { auth } from "../../firebaseConfig";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const UserInformation = () => {
    const { user } = useContext(authContext);

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
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
    const uploadPreset = "upload_preset_screenscout";

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

    const handleUploadComplete = (url) => {
        setFormData((prev) => ({ ...prev, photoUrl: url }));
        setIsLoading(false);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleReadOnly = async (e) => {
        e.preventDefault();
        if (!readonly) {
            if (!updateProfileValidation(formData, setError)) {
                return;
            }
            try {
                setIsLoading(true);
                setError(null);

                await updateProfile(user, {
                    displayName: `${formData.firstName} ${formData.lastName}`,
                    photoURL: formData.photoUrl,
                });

                if (formData.email !== user.email) {
                    await updateEmail(user, formData.email);
                }
            } catch (error) {
                setReadOnly((prev) => !prev);
                formatFireBaseFeedback(error.code, setError);
            } finally {
                setIsLoading(false);
            }
        }

        setReadOnly((prev) => !prev);
    };

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
                <div className={styles.userInofrmation}>
                    <form
                        onSubmit={toggleReadOnly}
                        className={styles.userInformationForm}
                    >
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
                                If you want to change your password, please
                                click the button:
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

                    {error && error.firebase && (
                        <InfoCard style="error" text={error.firebase} />
                    )}
                </div>
            )}
        </>
    );
};

export default UserInformation;
