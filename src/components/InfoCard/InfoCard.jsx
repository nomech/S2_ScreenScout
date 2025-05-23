import React from "react";
import styles from "./InfoCard.module.css";

const InfoCard = ({ style, text }) => {
    console.log(text);
    
    return (
        text && (
            <div className={`${styles.infoTextBox} ${styles[style]}`}>
                <p>{text}</p>
            </div>
        )
    );
};

export default InfoCard;
