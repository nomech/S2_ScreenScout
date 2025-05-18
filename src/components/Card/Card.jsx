import styles from "./Card.module.css";
import Button from "../Button/Button";

const Card = ({
    media,
    watchlist,
    onCardClick,
    onAddToWatchlist,
    onRemoveFromWatchlist,
}) => {
    const isInWatchlist = watchlist?.[media.media_type]?.includes(media.id);
    console.log(watchlist);

    return (
        <div
            className={styles.card}
            onClick={() => onCardClick(media.id, media.media_type)}
        >
            {!isInWatchlist && (
                <Button
                    className="addButton"
                    onClick={(e) => onAddToWatchlist(e, media)}
                >
                    +
                </Button>
            )}

            {isInWatchlist && (
                <Button
                    className="addButton"
                    onClick={(e) => onRemoveFromWatchlist(e, media)}
                >
                    -
                </Button>
            )}

            <img
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.title}
            />
            <div className={styles.mediaDetails}>
                <h3 className={styles.mediaTitle}>
                    {media.title || media.name}
                </h3>
            </div>
        </div>
    );
};

export default Card;
