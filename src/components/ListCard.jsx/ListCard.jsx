import styles from "./ListCard.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";
import { useContext } from "react";

const ListCard = ({ media, onCardClick, setWatchlist, isInWatchlist }) => {
    const { createWatchList, removeFromWatchList } = useWatchList();
    const { user } = useContext(authContext);

    const handleAddToWatchlist = async (e, media) => {
        e.stopPropagation();

        await createWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: [...(prev?.[media.media_type] || []), media.id],
        }));
    };

    const handleRemoveFromWatchlist = async (e, media) => {
        e.stopPropagation();
        console.log("media", media.id);
        await removeFromWatchList(user.uid, media.id, media.media_type);

        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: prev?.[media.media_type].filter((item) => {
                return item.id ? item.id !== media.id : item !== media.id;
            }),
        }));
    };

    return (
        <div
            className={styles.cardList}
            onClick={() => onCardClick(media.id, media.media_type)}
        >
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
                        {media.genre_ids?.map((genre) => (
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
                    {!isInWatchlist && (
                        <Button
                            className="watchlistButton"
                            onClick={(e) => handleAddToWatchlist(e, media)}
                        >
                            Add to Watchlist
                        </Button>
                    )}
                    {isInWatchlist && (
                        <Button
                            className="watchlistButton"
                            onClick={(e) => handleRemoveFromWatchlist(e, media)}
                        >
                            Remove from Watchlist
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListCard;
