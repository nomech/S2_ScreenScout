import React, { useContext } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { authContext } from "../../context/authContext";

const Navbar = () => {
  const { user } = useContext(authContext);
  return (
    <>
      <nav className={styles.navbar}>
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
            <li className={styles.navItem}>
              <NavLink to="/watchlist" className={styles.link}>
                Watchlist
              </NavLink>
            </li>
            <li className={`${styles.navItem} ${styles.profile}`}>Profile</li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default Navbar;
