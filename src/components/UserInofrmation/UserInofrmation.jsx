import React, { useContext, useEffect, useState } from "react";
import Input from "../Input/Input";
import styles from "./UserInformation.module.css";
import { authContext } from "../../context/authContext";
const UserInformation = () => {
    const { user } = useContext(authContext);

    const [firstName, setFirstName] = useState("");
    const [lasttName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.displayName.split(" ")[0]);
            setLastName(user.displayName.split(" ")[1]);
            setEmail(user.email);
        }
    }, [user]);

    return (
        <>
            {user && (
                <div className={styles.userInofrmation}>
                    <form>
                        <Input label="First name" value={firstName} />
                        <Input label="Last name" value={lasttName} />
                        <Input label="Email" value={email} />
                        
                    </form>
                </div>
            )}
        </>
    );
};

export default UserInformation;
