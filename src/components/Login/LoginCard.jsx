import styles from "./LoginCard.module.css";
import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginCard = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className={styles.loginCard}>
      <h1 className={styles.title}> ScreenScout</h1>
      <div className={styles.inputContainer}>
        <Input
          label="Email"
          placeholder="Enter your email"
          className="email"
          onChange={handleChange}
          name="email"
          type="email"
          value={formData.email}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          className="password"
          onChange={handleChange}
          name="password"
          type="password"
          value={formData.password}
        />
      </div>

      <NavLink to="/forgot-password" className={styles.link}>
        Forgot password?
      </NavLink>

      <Button
        ariaLabel="Login button"
        className="login"
        onClick={(e) => onSubmit(e)}
      >
        Sign in
      </Button>
    </div>
  );
};

export default LoginCard;
