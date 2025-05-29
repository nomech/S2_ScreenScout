import styles from "./ListCard.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";
import { useContext } from "react";

const ListCard = ({
    media,
    onCardClick,
    setWatchlist,
    isInWatchlist,
    toggleWatchStatus,
    isWatched,
    mediaType,
}) => {
    const {
        createWatchList,
        removeFromWatchList,
        markAsWatched,
        removeWatchedMedia,
    } = useWatchList();
    const { user, verified } = useContext(authContext);

    const handleAddToWatchlist = async (e, media) => {
        e.stopPropagation();
        await createWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: [...(prev?.[mediaType] || []), media.id],
        }));
    };

    const handleRemoveFromWatchlist = async (e, media) => {
        e.stopPropagation();
        await removeFromWatchList(user.uid, media.id, mediaType);
        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: prev?.[mediaType].filter((item) =>
                item.id ? item.id !== media.id : item !== media.id
            ),
        }));
    };

    const handleMarkAsWatched = async (e, id) => {
        e.stopPropagation();
        await markAsWatched(user.uid, id);
        toggleWatchStatus(id);
    };

    const handleRemoveAsWatched = async (e, id) => {
        e.stopPropagation();
        await removeWatchedMedia(user.uid, id);
        toggleWatchStatus(id);
    };

    const handleReview = (e) => {
        e.stopPropagation();
    };


    return (
        <div
            className={styles.cardList}
            onClick={() => onCardClick(media.id, mediaType)}
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
                        {media.genres?.map((genre) => (
                            <p key={genre.id} className={styles.genre}>
                                {genre?.name || genre}
                            </p>
                        ))}
                    </div>
                    <p className={styles.overview}>{media.overview}</p>
                    <div className={styles.votes}>
                        <p>{Math.round(media.vote_average)}/10</p>
                        <p>{media.vote_count} people voted</p>
                    </div>

                    <div className={styles.buttonContainer}>
                        <div className={styles.watchedReview}>
                            {!isWatched && verified && (
                                <Button
                                    className="watched"
                                    onClick={(e) =>
                                        handleMarkAsWatched(e, media.id)
                                    }
                                >
                                    Mark as Watched
                                </Button>
                            )}
                            {isWatched && (
                                <Button
                                    className="watched"
                                    onClick={(e) =>
                                        handleRemoveAsWatched(e, media.id)
                                    }
                                >
                                    Mark as not watched
                                </Button>
                            )}

                            {verified && (
                                <Button
                                    onClick={(e) => handleReview(e)}
                                    disabled={!isWatched}
                                    className={`${
                                        isWatched
                                            ? "activeReview"
                                            : "inactiveReview"
                                    }`}
                                >
                                    Review
                                </Button>
                            )}

                            {!isInWatchlist && verified && (
                                <Button
                                    className="addWatchlistButton"
                                    onClick={(e) =>
                                        handleAddToWatchlist(e, media)
                                    }
                                >
                                    Add to Watchlist
                                </Button>
                            )}

                            {isInWatchlist && (
                                <Button
                                    className="removeWatchlistButton"
                                    onClick={(e) =>
                                        handleRemoveFromWatchlist(e, media)
                                    }
                                >
                                    Remove from Watchlist
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
