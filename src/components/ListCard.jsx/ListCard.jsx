import styles from "./ListCard.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import { getAuthContext } from "../../context/authContext";
import { useState } from "react";
import VotePopUp from "../VotePopUp/VotePopUp";

// This component renders a card for displaying media details such as movies or TV shows in a list format.
const ListCard = ({
    media,
    onCardClick,
    setWatchlist,
    isInWatchlist,
    toggleWatchStatus,
    isWatched,
    mediaType,
    hasLinkedAccount,
}) => {
    const [voteOpen, setVoteOpen] = useState(false);

    // Importing functions from the useWatchList to manage watchlist actions
    const {
        createWatchList,
        removeFromWatchList,
        markAsWatched,
        removeWatchedMedia,
    } = useWatchList();
    const { user, verified } = getAuthContext();

    // Adds a media item to the user's watchlist
    const handleAddToWatchlist = async (e, media) => {
        e.stopPropagation();
        await createWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: [...(prev?.[mediaType] || []), media.id],
        }));
    };

    // Removes a media item from the user's watchlist
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

    // Marks a media item as watched
    const handleMarkAsWatched = async (e, id) => {
        e.stopPropagation();
        await markAsWatched(user.uid, id);
        toggleWatchStatus(id);
    };

    // Removes a media item from the watched list
    const handleRemoveAsWatched = async (e, id) => {
        e.stopPropagation();
        await removeWatchedMedia(user.uid, id);
        toggleWatchStatus(id);
    };

    // Opens the vote popup for the media item
    const handleOnClickVote = (e) => {
        e.stopPropagation();
        setVoteOpen(true);
    };

    return (
        <>
            <article
                className={styles.cardList}
                onClick={() => onCardClick(media.id, mediaType)}
                tabIndex={0}
                role="button"
            >
                <img
                    className={styles.backdrop}
                    src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                />

                <div className={styles.card}>
                    <figure>
                        <img
                            className={styles.poster}
                            src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                            alt={media.title}
                        />
                    </figure>
                    <p className={styles.id}>ID: {media.id}</p>
                    <div className={styles.mediaDetails}>
                        <header>
                            <h3 className={styles.mediaTitle}>
                                {media.title || media.name}
                            </h3>
                        </header>
                        <div className={styles.macroData}>
                            <time
                                className={styles.release}
                                dateTime={
                                    media.release_date || media.first_air_date
                                }
                                aria-label="Release date"
                            >
                                {media.release_date || media.first_air_date}
                            </time>
                            {media.genres?.map((genre) => (
                                <span
                                    key={genre.id}
                                    className={styles.genre}
                                    aria-hidden="true"
                                >
                                    {genre?.name || genre}
                                </span>
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
                                        ariaLabel={"Mark as not watched"}
                                    >
                                        Mark as not watched
                                    </Button>
                                )}

                                {verified && hasLinkedAccount && (
                                    <Button
                                        onClick={(e) => handleOnClickVote(e)}
                                        disabled={!isWatched}
                                        className={`${
                                            isWatched
                                                ? "activeReview"
                                                : "inactiveReview"
                                        }`}
                                        ariaLabel={"Review media"}
                                    >
                                        Vote
                                    </Button>
                                )}

                                {!isInWatchlist && verified && (
                                    <Button
                                        className="addWatchlistButton"
                                        onClick={(e) =>
                                            handleAddToWatchlist(e, media)
                                        }
                                        ariaLabel={"Add to watchlist"}
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
                                        ariaLabel={"Remove from watchlist"}
                                    >
                                        Remove from Watchlist
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            {voteOpen && (
                <VotePopUp
                    media={media}
                    user={user.uid}
                    setVoteOpen={setVoteOpen}
                />
            )}
        </>
    );
};

export default ListCard;
