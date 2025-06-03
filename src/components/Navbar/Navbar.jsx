import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { getAuthContext } from "../../context/authContext";
import Menu from "../Menu/Menu";
import placeholder from "../../assets/images/placeholder.png";
import menu from "../../assets/icons/menu.svg";

// This component renders a navigation bar with links to different sections of the application, including Home, Movies, TV Shows, and Watchlist if the user is verified. It also includes a profile menu that can be toggled open or closed.
const Navbar = () => {
    // State to manage the open/closed state of the profile menu
    const [isOpen, setIsOpen] = useState(false);

    // Context to access user information and verification status
    const { user, verified, profilePicture } = getAuthContext();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Reference to the menu element to handle clicks outside of it
    const menuRef = useRef();

    // Effect to handle clicks outside the menu to close it
    // https://www.youtube.com/watch?v=HfZ7pdhS43s
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If menuRef is not set or menu is not open, do nothing
            if (!menuRef.current || !isOpen) {
                return;
            }
            // If the click is inside the menu, do nothing
            if (menuRef.current.contains(event.target)) {
                return;
            }
            // If the click is on the menu icon, do nothing
            const menuIcon = document.querySelector(`.${styles.menu}`);

            // If the click is on the menu icon, do nothing
            if (menuIcon && menuIcon.contains(event.target)) {
                return;
            }
            // Otherwise, close the menu
            setIsOpen(false);
        };

        // Add event listener to document when the menu is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function to remove the event listener when the component unmounts or when isOpen changes
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <header>
                <nav className={styles.navbar}>
                    <div className={styles.wrapper}>
                        <NavLink to="/" className={styles.link}>
                            <h1 className={styles.title}>ScreenScout</h1>
                        </NavLink>
                        {/* Render navigation links only if the user is logged in */}
                        {user && (
                            <ul className={styles.navList}>
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
                                    } ${isOpen ? styles.active : ""} ${
                                        styles.menu
                                    }`}
                                    onClick={toggleMenu}
                                >
                                    <img src={menu} alt="Menu icon" />
                                </li>
                                <li
                                    className={`${styles.navItem} ${styles.profile}`}
                                >
                                    {/* Render the profile picture or a placeholder if not available */}
                                    <div className={styles.frame}>
                                        <img
                                            src={profilePicture || placeholder}
                                            alt="Profile"
                                            className={styles.profilePicture}
                                        />
                                    </div>
                                </li>
                            </ul>
                        )}

                        {/* Render the profile menu if it is open */}
                        <Menu
                            setIsOpen={setIsOpen}
                            isOpen={isOpen}
                            ref={menuRef}
                        />
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
