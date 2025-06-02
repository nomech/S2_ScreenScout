import React, { useState } from "react";
import Input from "../Input/Input";
import styles from "./ProfilePicture.module.css";
import placeholderImage from "../../assets/images/placeholder.png";

// This component allows users to upload a profile picture, preview it, and handle the upload process to Cloudinary.
const ProfilePicture = ({
    placeholder,
    cloudinaryName,
    uploadPreset,
    onUploadComplete,
    onError,
    label,
    readonly = false,
    setIsLoading,
    isLoading,
}) => {
    // State to manage the preview URL and upload status
    const [previewUrl, setPreviewUrl] = useState(placeholder);
    const [isUploading, setIsUploading] = useState(false);

    // Handle file selection and upload to Cloudinary
    const handleFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        // Validate the file type
        if (!file || !file.type.startsWith("image/")) {
            // Reset preview URL to placeholder if the file is invalid
            setPreviewUrl(placeholder);
            // Call onError callback if provided
            return onError("Please select a valid image file.");
        }

        // Create a local URL for the preview
        const localUrl = URL.createObjectURL(file);

        // Set the preview URL to the local URL for immediate feedback
        setPreviewUrl(localUrl);

        // Prepare the form data for Cloudinary upload
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);
        form.append("cloud_name", cloudinaryName);

        try {
            //
            setIsLoading(true);
            setIsUploading(true);

            // Upload the file to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
                { method: "POST", body: form }
            );

            // Check if the response is OK
            if (!response.ok) {
                throw new Error("Failed to upload image.");
            }

            // Parse the response data
            const data = await response.json();

            // Set the preview URL to the secure URL from Cloudinary
            setPreviewUrl(data.secure_url);

            // Call the onUploadComplete callback with the secure URL
            onUploadComplete(data.secure_url);
        } catch (error) {
            console.error("Upload error:", error);
            onError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profilePicture}>
                <div className={styles.frame}>
                    <img
                        src={previewUrl || placeholderImage}
                        alt="Profile preview"
                    />
                </div>
            </div>

            <Input
                label={`${!isUploading ? label : "Uploading…"}`}
                className="file-uploader"
                type="file"
                onChange={handleFileChange}
                id="upload"
                name="upload"
                readonly={readonly || isUploading || isLoading}
            />
        </div>
    );
};

export default ProfilePicture;
