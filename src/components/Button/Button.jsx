import styles from "./Button.module.css";

const Button = ({
    children = "Click",
    onClick,
    className,
    disabled = false,
    ariaLabel,
    type,
    ref,
    value,
}) => {
    return (
        // The Button component is a reusable button component that can be customized with different styles and properties.
        <button
            className={`${styles.button} ${styles[className]}`}
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            type={type}
            ref={ref}
            value={value}
        >
            {children}
        </button>
    );
};

export default Button;
