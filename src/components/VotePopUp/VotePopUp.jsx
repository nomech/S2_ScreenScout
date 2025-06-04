import { useState } from 'react';
import styles from './VotePopUp.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { checkSessionId } from '../../utils/linkAccountwithTmdb';
import InfoCard from '../InfoCard/InfoCard';

const VotePopUp = ({ media, user, setVoteOpen }) => {
	const [vote, setVote] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	// Function to handle changes in the vote input field
	const handleOnChangeVote = (e) => {
		let value = e.target.value;
		// Ensure value is a number and clamp between 1 and 10
		value = Math.max(1, Math.min(10, Number(value)));
		setVote(value);
	};

	// Function to handle the click event for submitting the vote
	const handleOnClickVote = async (e, media) => {
		e.stopPropagation();

		// Validate that the user has a session ID
		const sessionId = await checkSessionId(user);
		if (!sessionId) {
			console.error('No session ID found for user:', user);
			return;
		}

		// Construct the URL for submitting the vote
		const voteUrl = `https://api.themoviedb.org/3/${media.media_type}/${media.id}/rating?session_id=${sessionId}`;

		// Prepare the options for the fetch request
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
			},
			body: JSON.stringify({ value: parseFloat(vote) }),
		};

		try {
			setError('');
			setSuccess('');
			setLoading(true);

			const response = await fetch(voteUrl, options);
			const data = await response.json();
			if (data.success) {
				setSuccess('Vote submitted!');
			} else {
				throw new Error(`Failed to submit vote: ${data.status_message}`);
			}
		} catch (error) {
			setError('Failed to submit vote. Please try again.');
			console.error('Error submitting vote:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={styles.overlay}
			role="dialog"
			aria-modal="true"
			aria-labelledby="vote-popup-title"
		>
			<section className={styles.votePopUp}>
				<header>
					<h2 id="vote-popup-title">{media.name || media.title}</h2>
				</header>
				<figure>
					<img
						src={`https://image.tmdb.org/t/p/w200/${media.poster_path}`}
						alt={media.name || media.title}
						className={styles.voteImage}
					/>
				</figure>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleOnClickVote(e, media);
					}}
					aria-describedby="vote-popup-message"
				>
					<Input
						label={'Vote between 1 and 10'}
						type="number"
						min="1"
						max="10"
						value={vote}
						onChange={handleOnChangeVote}
						required
						aria-required="true"
						aria-label="Vote between 1 and 10"
					/>
					<div className={styles.buttonContainer}>
						<Button
							className="voteButton"
							type="submit"
							disabled={loading || vote < 1 || vote > 10}
						>
							{loading ? 'Submitting...' : 'Submit Vote'}
						</Button>
						<Button
							className="voteButton"
							type="button"
							onClick={() => setVoteOpen(false)}
							disabled={loading}
						>
							Close
						</Button>
					</div>
					<div className={styles.message}>
						{error && <InfoCard style="error" text={error} />}
						{success && <InfoCard style="success" text={success} />}
					</div>
				</form>
			</section>
		</div>
	);
};

export default VotePopUp;
