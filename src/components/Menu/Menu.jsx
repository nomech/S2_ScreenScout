import React, { useContext } from "react";
import { authContext } from "../../context/authContext";
import Button from "../Button/Button";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";

const Menu = ({ setIsOpen }) => {
  const { signOut } = useContext(authContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={styles.menu}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <Button
            className="menuButton"
            onClick={() => navigate("/preferences")}
          >
            Preferences
          </Button>
        </li>
        <li className={styles.listItem}>
          <Button className="menuButton" onClick={() => navigate("/stats")}>
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
