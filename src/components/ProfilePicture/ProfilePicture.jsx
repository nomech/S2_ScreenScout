import React, { useState } from "react";
import Input from "../Input/Input";
import styles from "./ProfilePicture.module.css";

const ProfilePicture = ({
    placeholder,
    cloudinaryName,
    uploadPreset,
    onUploadComplete,
    onError,
    label,
    readonly = false,
    setIsLoading,
}) => {
    const [previewUrl, setPreviewUrl] = useState(placeholder);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file || !file.type.startsWith("image/")) {
            setPreviewUrl(placeholder);
            return onError && onError("Please select a valid image file.");
        }

        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);
        form.append("cloud_name", cloudinaryName);

        try {
            setIsLoading(true);
            setIsUploading(true);
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
                { method: "POST", body: form }
            );
            const data = await res.json();

            setPreviewUrl(data.secure_url);
            onUploadComplete && onUploadComplete(data.secure_url);
        } catch (err) {
            console.error("Upload error:", err);
            onError && onError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profilePicture}>
                <img src={previewUrl} alt="Profile preview" />
            </div>
            <Input
                label={`${!isUploading ? label : "Uploading…"}`}
                className="file-uploader"
                type="file"
                onChange={handleFileChange}
                id="upload"
                name="upload"
                readonly={readonly || isUploading}
            />
        </div>
    );
};

export default ProfilePicture;
