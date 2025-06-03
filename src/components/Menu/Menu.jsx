import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "../Button/Button";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";

// This component renders a menu for user actions such as settings, stats, and sign out.
const Menu = ({ setIsOpen, isOpen, ref }) => {
    // Importing the auth context to access authentication functions
    const { signOutUser } = useContext(AuthContext);

    // Using the useNavigate hook from react-router-dom to programmatically navigate
    const navigate = useNavigate();

    // Function to handle user sign out
    const handleSignOut = async () => {
        try {
            setIsOpen(false);
            await signOutUser();
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        // Render the menu with buttons for settings, stats, and sign out
        <div
            className={`${styles.menu} ${
                isOpen ? styles.active : styles.inactive
            }`}
            ref={ref}
        >
            <ul className={styles.list}>
                <li className={`${styles.listItem} ${styles.mobileOnly}`}>
                    <Button
                        onClick={() => navigate("/movies")}
                        className="menuButton"
                    >
                        Movies
                    </Button>
                </li>
                <li className={`${styles.listItem} ${styles.mobileOnly}`}>
                    <Button
                        className="menuButton"
                        onClick={() => navigate("/tv-shows")}
                    >
                        TV Shows
                    </Button>
                </li>
                <li className={`${styles.listItem} ${styles.mobileOnly}`}>
                    <Button
                        onClick={() => navigate("/watchlist")}
                        className="menuButton"
                    >
                        Watchlist
                    </Button>
                </li>
                <li className={styles.listItem}>
                    <Button
                        className="menuButton"
                        onClick={() => navigate("/settings")}
                    >
                        Settings
                    </Button>
                </li>
                <li className={styles.listItem}>
                    <Button
                        className="menuButton"
                        onClick={() => navigate("/stats")}
                    >
                        Stats
                    </Button>
                </li>
                <li className={styles.listItem}>
                    <Button className="menuButton" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
