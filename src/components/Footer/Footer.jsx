import React from "react";
import styles from "./Footer.module.css";
import tmdbLogo from "../../assets/images/tmdb.svg";

const Footer = () => {
    return (
        <footer>
            <p className={styles.footerText}>
                © {new Date().getFullYear()} ScreenScout
            </p>
            <img
                className={styles.footerLogo}
                src={tmdbLogo}
                alt="The Movie Database"
            />
        </footer>
    );
};

export default Footer;
