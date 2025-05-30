import styles from "./Input.module.css";

// This component renders a styled input field with optional label, error message, and various properties.
const Input = ({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onKeyDown,
    error,
    className,
    id,
    name,
    readonly = false,
}) => {
    return (
        // Render an input field with a label and error message if applicable
        <div className={styles.inputGroup}>
            {label && (
                <label
                    htmlFor={id}
                    className={`${styles.label} ${styles[id]} `}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${styles.input} ${styles[className]}`}
                id={id}
                onKeyDown={onKeyDown}
                name={name}
                readOnly={readonly}
            />
            {error && error[id] && (
                <p className={styles.errorText}>{error[id]}</p>
            )}
        </div>
    );
};

export default Input;
