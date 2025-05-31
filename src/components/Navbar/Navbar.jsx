import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Menu from "../Menu/Menu";

// This component renders a navigation bar with links to different sections of the application, including Home, Movies, TV Shows, and Watchlist if the user is verified. It also includes a profile menu that can be toggled open or closed.
const Navbar = () => {
    // State to manage the open/closed state of the profile menu
    const [isOpen, setIsOpen] = useState(false);

    // Context to access user information and verification status
    const { user, verified } = useContext(AuthContext);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Reference to the menu element to handle clicks outside of it
    const menuRef = useRef();

    // Effect to handle clicks outside the menu to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener for mousedown events when the menu is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup the event listener when the component unmounts or when isOpen changes
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <header>
                <nav className={styles.navbar}>
                    <div className={styles.wrapper}>
                        <h1 className={styles.title}>ScreenScout</h1>

                        {/* Render navigation links only if the user is logged in */}
                        {user && (
                            <ul className={styles.navList}>
                                <li className={styles.navItem}>
                                    <NavLink to="/" className={styles.link}>
                                        Home
                                    </NavLink>
                                </li>
                                <li className={styles.navItem}>
                                    <NavLink
                                        to="/movies"
                                        className={styles.link}
                                    >
                                        Movies
                                    </NavLink>
                                </li>
                                <li className={styles.navItem}>
                                    <NavLink
                                        to="/tv-shows"
                                        className={styles.link}
                                    >
                                        TV Shows
                                    </NavLink>
                                </li>

                                {/* Render Watchlist link only if the user is verified */}
                                {verified && (
                                    <li className={styles.navItem}>
                                        <NavLink
                                            to="/watchlist"
                                            className={styles.link}
                                        >
                                            Watchlist
                                        </NavLink>
                                    </li>
                                )}

                                {/* Profile menu item that toggles the menu when clicked */}
                                <li
                                    className={`${styles.navItem} ${
                                        styles.profile
                                    } ${isOpen ? styles.active : ""}`}
                                    onClick={toggleMenu}
                                >
                                    Profile
                                </li>
                                <li className={styles.navItem}>
                                    <div className={styles.frame}>
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className={styles.profilePicture}
                                        />
                                    </div>
                                </li>
                            </ul>
                        )}
                        {/* Render the profile menu if it is open */}
                        {isOpen && <Menu setIsOpen={setIsOpen} ref={menuRef} />}
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
