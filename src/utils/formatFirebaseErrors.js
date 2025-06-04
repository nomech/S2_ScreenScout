const errorMessages = {
	'auth/invalid-email': 'Please enter a valid email',
	'auth/missing-password': 'Please enter a password',
	'auth/invalid-credential': 'Wrong username or password',
	'auth/too-many-requests': 'You have tried to many times, please try again later',
	'auth/operation-not-allowed': 'Please verify the new email before changing email',
	'auth/email-already-in-use': 'This email is already in use',
	'auth/user-not-found': 'User not found, please sign up',
};

export const formatFireBaseFeedback = (data, setError) => {
	const formattedFeedback = { firebase: errorMessages[data] };
	console.log(formattedFeedback);

	return setError(formattedFeedback);
};
