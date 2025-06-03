const errorMessages = {
	'auth/invalid-email': 'Please enter a valid email',
	'auth/missing-password': 'Please enter a password',
	'auth/invalid-credential': 'Wrong username or password',
	'auth/too-many-requests': 'You have tried to many times, please try again later',
	'auth/operation-not-allowed': 'Please verify the new email before changing email',
};

export const formatFireBaseFeedback = (data, setError) => {
	const formattedFeedback = { firebase: errorMessages[data] };

	return setError(formattedFeedback);
};
