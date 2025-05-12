import React from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.code}>404</h1>
            <h2 className={styles.text}>Page not found</h2>
            <p className={styles.description}>
                Oops! The page you're looking for seems to have vanished like a
                plot twist in a mystery movie. It might have been moved,
                deleted, or never existed in the first place.
            </p>
        </div>
    );
};

export default NotFound;
