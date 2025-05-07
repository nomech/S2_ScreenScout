import styles from "./ForgotPasswordCard.module.css";
import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { forgotPasswordFormValidation } from "../../utils/formValidation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";

const ForgotPasswordCard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState({ email: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => navigate("/login"), 3000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEmail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!forgotPasswordFormValidation(email, setError)) {
      return;
    }

    try {
      setIsloading(true);
      await sendPasswordResetEmail(auth, email.email);
      setSuccess(
        `A password reset link was sent to ${email.email} if it exists`
      );
      setEmail({ email: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <form className={styles.forgotPasswordCard} onSubmit={(e) => onSubmit(e)}>
      <h1 className={styles.title}> ScreenScout</h1>
      {!success && (
        <>
          <div className={styles.inputContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              className="email"
              type="email"
              value={email.email}
              name={"email"}
              id="email"
              onChange={handleOnChange}
              error={error}
            />
          </div>

          <div className={styles.linkContainer}>
            <NavLink to="/signup" className={styles.link}>
              Create Account
            </NavLink>

            <NavLink to="/login" className={styles.link}>
              Sign in
            </NavLink>
          </div>

          <Button
            ariaLabel="Reset button"
            className="login"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Sending link..." : "Reeset Password"}
          </Button>
        </>
      )}
      {success && (
        <div className={styles.successMessage}>
          <p>{success}</p>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordCard;
