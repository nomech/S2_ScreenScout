import React, { useEffect } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./SignupCard.module.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { signupFormValidation } from "../../utils/formValidation";

const SignupCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => navigate("/login"), 3000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

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

    if (!signupFormValidation(formData, setError)) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      await updateProfile(user, {
        displayName: formData.name,
      });

      navigate("/");
    } catch (error) {
      if (error.code === "auth/password-does-not-meet-requirements") {
        setError((prev) => ({
          ...prev,
          confirmPassword: error.message
            .replace("Firebase: ", "")
            .replace("(auth/password-does-not-meet-requirements).", ""),
        }));
      } else {
        setError(error);
      }
    } finally {
      setIsLoading(false);
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

      <NavLink to="/login" className={styles.link}>
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
