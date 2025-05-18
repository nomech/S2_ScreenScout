import styles from "./ListCard.module.css";
import Button from "../Button/Button";

const ListCard = ({ media, user, onAddToWatchlist }) => {
    return (
        <div className={styles.cardList}>
            <img
                className={styles.backdrop}
                src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                alt=""
            />
            <div className={styles.card}>
                <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                    alt={media.title}
                />
                <p className={styles.id}>ID: {media.id}</p>
                <div className={styles.mediaDetails}>
                    <h3 className={styles.mediaTitle}>
                        {media.title || media.name}
                    </h3>
                    <div className={styles.macroData}>
                        <p className={styles.release}>
                            {media.release_date || media.first_air_date}
                        </p>
                        {media.genre_ids.map((genre) => (
                            <p key={genre} className={styles.genre}>
                                {genre}
                            </p>
                        ))}
                    </div>
                    <p className={styles.overview}>{media.overview}</p>
                    <div className={styles.votes}>
                        <p>{Math.round(media.vote_average)}/10</p>
                        <p>{media.vote_count} people voted</p>
                    </div>
                    <Button
                        className="watchlistButton"
                        onClick={() => onAddToWatchlist(user.uid, media)}
                    >
                        Add to Watchlist
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
