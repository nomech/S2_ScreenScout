import { useFetch } from '../../hooks/useFetch';
import styles from './DetailedCard.module.css';
import Loading from '../Loading/Loading';
import Button from '../Button/Button';
import film from '../../assets/icons/film.svg';
import placeholder from '../../assets/images/placeholder.png';

// This component displays detailed information about a specific media item (movie or TV show).
const DetailedCard = ({ id, mediaType, onClose }) => {
	// Fetch media details from The Movie Database (TMDB) API
	// Use the custom hook useFetch to get media data and handle loading and error states
	// An alias for the mediaType is used to determine if it's a media or credit

	const movieUrl = `https://api.themoviedb.org/3/${mediaType}/${id}`;
	const { data: media, error: mediaError, isLoading: mediaIsLoading } = useFetch(movieUrl);

	const creditsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/credits`;
	const { data: credits, error: creditsError, isLoading: creditsLoading } = useFetch(creditsUrl);

	// Function to get the image source URL based on the path and size
	const getImgSrc = (path, size = 'original') => {
		return path ? `https://image.tmdb.org/t/p/${size}${path}` : film;
	};

	return (
		<>
			{/* Conditional rendering based on loading and error states */}
			{mediaIsLoading && (
				<div className={styles.backlay}>
					<div className={styles.loadingContainer}>
						<Button className="closeButton" onClick={onClose}>
							X
						</Button>
						<Loading />
					</div>
				</div>
			)}

			{/* Display error message if media data fails to load */}
			{mediaError && <p className={styles.error}>Error loading media</p>}

			{/* If media data is successfully fetched, display detailed information */}
			{media && (
				<aside className={styles.backlay}>
					<article className={styles.detailedCardContainer}>
						{/* Close button to exit the detailed view */}
						<Button className="closeButton" onClick={onClose} ariaLabel="Close details">
							X
						</Button>
						{/* Background image for the detailed card */}
						<img
							className={styles.backdrop}
							src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
							alt=""
							aria-hidden="true"
							loading="lazy"
						/>
						{/* Overlay containing media details and credits */}
						<div className={styles.overlay}>
							<section className={styles.detailsContainer}>
								{/* Display media poster, title, release date, genres, runtime, tagline, and overview */}
								<figure>
									<img
										className={styles.poster}
										src={getImgSrc(media.poster_path, 'w300')}
										alt={media.title}
									/>
								</figure>
								<div className={styles.details}>
									<h1 className={styles.title}>
										{media.title ? media.title : media.name}
									</h1>
									<div className={styles.macroData}>
										<time
											dateTime={
												media.release_date
													? media.release_date
													: media.first_air_date
											}
										>
											{media.release_date
												? media.release_date
												: media.first_air_date}
										</time>
										<span>|</span>
										<ul className={styles.genreList}>
											{media.genres?.map((genre) => (
												<li
													key={genre.id}
													className={styles.genre}
													aria-hidden="true"
												>
													{genre.name}
												</li>
											))}
										</ul>

										<span>|</span>
										<p>
											{media.runtime
												? media.runtime + ' min'
												: 'E' + media.number_of_episodes}
										</p>
									</div>
									<p className={styles.tagline}>{media.tagline}</p>
									<p className={styles.overview}>{media.overview}</p>
								</div>
								<p className={styles.id}>ID: {media.id}</p>
							</section>

							{/* Display credits (actors) related to the media */}
							<section className={styles.actorContainer}>
								{creditsLoading && <Loading />}
								{/* Display error message if credits data fails to load */}
								{creditsError && (
									<p className={styles.error}>Error loading credits</p>
								)}

								{/* If credits data is successfully fetched, map through the cast array to display each actor's information */}
								{credits &&
									credits.cast.map((actor) => (
										<div key={actor.id} className={styles.actor}>
											{/* Display actor's profile image, name, and character */}
											<div className={styles.profile}>
												<figure>
													<img
														className={styles.actorImg}
														src={
															actor.profile_path
																? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
																: placeholder
														}
														alt={actor.name}
													/>
												</figure>
											</div>
											<div className={styles.nameContainer}>
												<p className={styles.name}>{actor.name}</p>
												<p className={styles.character}>
													{actor.character}
												</p>
											</div>
										</div>
									))}
							</section>
						</div>
					</article>
				</aside>
			)}
		</>
	);
};

export default DetailedCard;
