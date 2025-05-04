import styles from "./Button.module.css";

const Button = ({
  children = "Click",
  onClick,
  className,
  disabled = false,
  ariaLabel,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[className]}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
