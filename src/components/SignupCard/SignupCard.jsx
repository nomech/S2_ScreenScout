import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from 'firebase/auth';
import Input from '../Input/Input';
import Button from '../Button/Button';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import styles from './SignupCard.module.css';
import { auth } from '../../firebaseConfig';
import { signupFormValidation } from '../../utils/formValidation';
import placeholder from '../../assets/images/placeholder.png';
import InfoCard from '../InfoCard/InfoCard';
import { formatFireBaseFeedback } from '../../utils/formatFirebaseErrors';

// This component renders a signup form for users to create an account, including fields for personal information and a profile picture upload feature.
const SignupCard = () => {
	// State to manage form data, error messages, loading state, and success state
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		photoUrl: '',
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [firestoreError, setFirestoreError] = useState('');

	// Hook to navigate programmatically
	const navigate = useNavigate();

	// Cloudinary configuration for profile picture upload
	const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
	const uploadPreset = 'upload_preset_screenscout';

	// Effect to handle redirection after successful signup
	useEffect(() => {
		if (success) {
			let timer;
			timer = setTimeout(() => navigate('/login'), 3000);
			return () => clearTimeout(timer);
		}
	}, [success, navigate]);

	// Function to handle input changes in the form
	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Function to handle the completion of profile picture upload
	const handleUploadComplete = (url) => {
		setFormData((prev) => ({ ...prev, photoUrl: url }));
	};

	// Function to handle form submission for user signup
	const handleSignUp = async (e) => {
		e.preventDefault();
		setError(null);
		setFirestoreError('');

		// Validate the form data before proceeding
		if (!signupFormValidation(formData, setError)) return;

		setIsLoading(true);
		try {
			// Create a new user with email and password
			const { user } = await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);

			// Update the user's profile with additional information
			await updateProfile(user, {
				displayName: `${formData.firstName} ${formData.lastName}`,
				photoURL: formData.photoUrl,
			});

			// Send email verification to the user
			await sendEmailVerification(user);
			setSuccess(true);

			// Reset the form data after successful signup
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				confirmPassword: '',
				photoUrl: '',
			});

			// Redirect to the home page after signup
			navigate('/');
		} catch (error) {
			// Handle errors during signup
			formatFireBaseFeedback(error.code, setFirestoreError);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		// Render the signup form with input fields, profile picture upload, and a button to submit the form
		<form className={styles.signupCard} onSubmit={handleSignUp}>
			<h1 className={styles.title}>ScreenScout</h1>
			<div className={styles.inputContainer}>
				<ProfilePicture
					placeholder={placeholder}
					cloudinaryName={cloudinaryName}
					uploadPreset={uploadPreset}
					onUploadComplete={handleUploadComplete}
					onError={setError}
					label="Add a profile picture +"
				/>

				<Input
					label="First name"
					placeholder="Enter your first name"
					type="text"
					value={formData.firstName}
					onChange={handleOnChange}
					id="firstName"
					name="firstName"
					error={error}
				/>
				<Input
					label="Last name"
					placeholder="Enter your last name"
					type="text"
					value={formData.lastName}
					onChange={handleOnChange}
					id="lastName"
					name="lastName"
					error={error}
				/>
				<Input
					label="Email"
					placeholder="Enter your email"
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
					type="password"
					value={formData.confirmPassword}
					onChange={handleOnChange}
					id="confirmPassword"
					name="confirmPassword"
					error={error}
				/>
			</div>

			{/* Display link to login page if user already has an account */}
			<NavLink to="/login" className={styles.link}>
				Already have an account? Sign in
			</NavLink>
			{firestoreError && firestoreError.firebase && (
				<InfoCard style="error" text={firestoreError.firebase} />
			)}
			<Button ariaLabel="Signup button" className="signup" disabled={isLoading} type="submit">
				{isLoading ? 'Creating...' : 'Create Account'}
			</Button>
		</form>
	);
};

export default SignupCard;
