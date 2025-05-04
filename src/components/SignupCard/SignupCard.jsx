import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./SignupCard.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import formValidation from "../../utils/formValidation";

const SignupCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formValidation(formData, setError)) {
      return;
    }

    setIsloading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log(`Success! ${user.email} has been created`);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className={styles.signupCard}>
      <h1 className={styles.title}> ScreenScout</h1>
      <div className={styles.inputContainer}>
        <Input
          label="Full name"
          placeholder="Enter your name"
          className="name"
          type="text"
          value={formData.name}
          onChange={handleOnChange}
          id="name"
          name="name"
          error={error}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          className="email"
          type="email"
          value={formData.email}
          onChange={handleOnChange}
          id="email"
          name="email"
          error={error}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          className="password"
          type="password"
          value={formData.password}
          onChange={handleOnChange}
          id="password"
          name="password"
          error={error}
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          className="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleOnChange}
          id="confirmPassword"
          name="confirmPassword"
          error={error}
        />
      </div>

      <NavLink to="/login" className={styles.forgotPasswordLink}>
        Already have an account? Sign in
      </NavLink>

      <Button
        ariaLabel="Login button"
        className="signup"
        onClick={(e) => handleSignUp(e)}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Account"}
      </Button>
    </div>
  );
};

export default SignupCard;
