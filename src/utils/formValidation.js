export const signupFormValidation = (formData, setError) => {
  let validForm = true;
  if (!formData.name) {
    setError((prev) => ({ ...prev, name: "Name is required" }));
    validForm = false;
  }
  if (!formData.email) {
    setError((prev) => ({ ...prev, email: "Email is required" }));
    validForm = false;
  }
  if (!formData.password) {
    setError((prev) => ({ ...prev, password: "Password is required" }));
    validForm = false;
  }
  if (!formData.confirmPassword) {
    setError((prev) => ({
      ...prev,
      confirmPassword: "Confirm Password is required",
    }));
    validForm = false;
  }

  if (formData.password !== formData.confirmPassword) {
    setError((prev) => ({
      ...prev,
      confirmPassword: "Passwords do not match",
    }));
    validForm = false;
  }

  if (formData.password.length < 6) {
    setError((prev) => ({
      ...prev,
      password: "Password must be at least 6 characters long",
    }));
    validForm = false;
  }
  if (formData.email.length > 0 && !/\S+@\S+\.\S+/.test(formData.email)) {
    setError((prev) => ({ ...prev, email: "Invalid email address" }));
    validForm = false;
  }

  return validForm;
};

export const forgotPasswordFormValidation = (email, setError) => {
  let validForm = true;
  setError(null);
  if (email.email.length === 0) {
    setError((prev) => ({ ...prev, email: "Email is required" }));
    validForm = false;
  }
  if (email.email.length > 0 && !/\S+@\S+\.\S+/.test(email.email)) {
    setError((prev) => ({ ...prev, email: "Invalid email address" }));
    validForm = false;
  }
  return validForm;
};
