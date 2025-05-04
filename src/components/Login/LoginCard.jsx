import styles from "./LoginCard.module.css";
import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { NavLink } from "react-router-dom";

const LoginCard = () => {
  return (
    <div className={styles.loginCard}>
      <h1 className={styles.title}> ScreenScout</h1>
      <div className={styles.inputContainer}>
        <Input label="Email" placeholder="Enter your email" className="email" />
        <Input
          label="Password"
          placeholder="Enter your password"
          className="password"
        />
      </div>

      <NavLink to="#" className={styles.forgotPasswordLink}>
        Forgot password?
      </NavLink>

      <Button ariaLabel="Login button" className="login">
        Sign in
      </Button>
    </div>
  );
};

export default LoginCard;
