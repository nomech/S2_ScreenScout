const emailRegex = /\S+@\S+\.\S+/;

const errorMessages = {
    firstName: "First name is required",
    lastName: "Last name is required",
    email: "Email is required",
    emailValid: "Invalid email address",
    passwordRequired: "Password is required",
    passwordLength: "Password must be at least 6 characters long",
    confirmPasswordRequired: "Confirm Password is required",
    confirmPasswordMatch: "Passwords do not match",
};

export const signInValidation = (formData, setError) => {
    const { email, password } = formData;
    const errors = {};

    !email ? (errors.email = errorMessages.emailValid) : "";
    email && !emailRegex.test(email)
        ? (errors.email = errorMessages.emailValid)
        : "";
    !password ? (errors.password = errorMessages.passwordRequired) : "";

    setError(errors);

    return Object.keys(errors).length === 0;
};

export const signupFormValidation = (formData, setError) => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const errors = {};

    !firstName ? (errors.firstName = errorMessages.firstName) : "";
    !lastName ? (errors.lastName = errorMessages.lastName) : "";
    !email ? (errors.email = errorMessages.email) : "";
    password.length < 6 ? (errors.password = errorMessages.passwordLength) : "";
    !password ? (errors.password = errorMessages.passwordRequired) : "";
    password !== confirmPassword
        ? (errors.confirmPassword = errorMessages.confirmPasswordMatch)
        : "";
    !confirmPassword
        ? (errors.confirmPassword = errorMessages.confirmPasswordRequired)
        : "";
    email && !emailRegex.test(email)
        ? (errors.email = errorMessages.emailValid)
        : "";

    setError(errors);
    return Object.keys(errors).length === 0;
};

export const forgotPasswordFormValidation = (formData, setError) => {
    const { email } = formData;
    const errors = {};

    !email ? (errors.email = errorMessages.email) : "";
    email && !emailRegex.test(email)
        ? (errors.email = errorMessages.emailValid)
        : "";

    setError(errors);
    return Object.keys(errors).length === 0;
};

export const updateProfileValidation = (formData, setError) => {
    const { firstName, lastName, email } = formData;
    const errors = {};

    !firstName ? (errors.firstName = errorMessages.firstName) : "";
    !lastName ? (errors.lastName = errorMessages.lastName) : "";
    !email ? (errors.email = errorMessages.email) : "";
    email && !emailRegex.test(email)
        ? (errors.email = errorMessages.emailValid)
        : "";

    setError(errors);
    
    return Object.keys(errors).length === 0;
};
