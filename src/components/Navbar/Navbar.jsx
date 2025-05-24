import React, { useState, useContext } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { authContext } from "../../context/authContext";
import Menu from "../Menu/Menu";

const Navbar = () => {
    const { user, verified } = useContext(authContext);

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.wrapper}>
                    <h1 className={styles.title}>ScreenScout</h1>
                    {user && (
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>
                                <NavLink to="/" className={styles.link}>
                                    Home
                                </NavLink>
                            </li>
                            <li className={styles.navItem}>
                                <NavLink to="/movies" className={styles.link}>
                                    Movies
                                </NavLink>
                            </li>
                            <li className={styles.navItem}>
                                <NavLink to="/tv-shows" className={styles.link}>
                                    TV Shows
                                </NavLink>
                            </li>
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
                    {isOpen && <Menu setIsOpen={setIsOpen} />}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
