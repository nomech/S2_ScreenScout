import React, { useContext } from "react";
import { authContext } from "../../context/authContext";
import Button from "../Button/Button";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";

const Menu = ({ setIsOpen, ref }) => {
    const { signOutUser } = useContext(authContext);
    const navigate = useNavigate();

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
        <div className={styles.menu} ref={ref}>
            <ul className={styles.list}>
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
