import React from "react";
import styles from "./InfoCard.module.css";

// This component displays an informational card with a text message.
const InfoCard = ({ style, text }) => {
    return (
        text && (
            <div className={`${styles.infoTextBox} ${styles[style]}`}>
                <p>{text}</p>
            </div>
        )
    );
};

export default InfoCard;
