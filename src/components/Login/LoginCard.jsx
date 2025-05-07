import styles from "./LoginCard.module.css";
import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <form className={styles.loginCard} onSubmit={(e) => onSubmit(e)}>
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

      <div className={styles.linkContainer}>
        <NavLink to="/signup" className={styles.link}>
          Create Account
        </NavLink>

        <NavLink to="/forgot-password" className={styles.link}>
          Forgot password?
        </NavLink>
      </div>
      <Button ariaLabel="Login button" className="login" type="submit">
        Sign in
      </Button>
    </form>
  );
};

export default LoginCard;
