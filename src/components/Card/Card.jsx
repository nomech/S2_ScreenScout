import styles from "./Card.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";
import minus from "../../assets/icons/minus.svg";
import plus from "../../assets/icons/plus.svg";
import eye from "../../assets/icons/eye.svg";
import eyeClosed from "../../assets/icons/eye-closed.svg";
import solidStar from "../../assets/icons/star-solid.svg";

import VotePopUp from "../VotePopUp/VotePopUp";

// This component represents a card that displays media information such as movies or TV shows.
const Card = ({
    media,
    onCardClick,
    isInWatchlist,
    setWatchlist,
    toggleWatchStatus,
    isWatched,
    mediaType,
    hasLinkedAccount,
}) => {
    const [voteOpen, setVoteOpen] = useState(false);

    // Destructure the functions from useWatchList hook to manage watchlist actions
    const {
        createWatchList,
        removeFromWatchList,
        markAsWatched,
        removeWatchedMedia,
    } = useWatchList();

    // Context to access user authentication
    const { user, verified } = useContext(AuthContext);

    // Check if the media is in the user's watchlist
    const handleAddToWatchlist = async (e, media) => {
        // Prevent the event from bubbling up to parent elements
        e.stopPropagation();

        // Create a watchlist entry for the user if it doesn't exist
        await createWatchList(user.uid, media);

        // Update the watchlist state by adding the media ID to the appropriate media type
        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: [...(prev?.[mediaType] || null), media.id],
        }));
    };

    // Remove the media from the user's watchlist
    const handleRemoveFromWatchlist = async (e, media) => {
        // Prevent the event from bubbling up to parent elements
        e.stopPropagation();

        // Remove the media from the user's watchlist
        await removeFromWatchList(user.uid, media.id, mediaType);

        // Update the watchlist state by filtering out the media ID from the appropriate media type
        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: prev?.[mediaType].filter((item) => {
                return item.id ? item.id !== media.id : item !== media.id;
            }),
        }));
    };

    // Handle marking media as watched or removing it from watched status
    const handleMarkAsWatched = async (e, id) => {
        e.stopPropagation();
        await markAsWatched(user.uid, id);
        toggleWatchStatus(id);
    };

    // Handle removing media from watched status
    const handleRemoveAsWatched = async (e, id) => {
        e.stopPropagation();
        await removeWatchedMedia(user.uid, id);
        toggleWatchStatus(id);
    };

    const handleOnClickVote = (e) => {
        e.stopPropagation();
        setVoteOpen(true);
    };

    // Set the media type based on the media object
    media.media_type = mediaType;

    return (
        <>
            <article
                className={styles.card}
                onClick={() => onCardClick(media.id, mediaType)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onCardClick(media.id, mediaType);
                    }
                }}
                tabIndex={0}
            >
                <div className={styles.buttonContainer}>
                    {/* If the media is not in the watchlist and the user is verified, show the watch button */}
                    {!isWatched && verified && (
                        <Button
                            className="watchButton"
                            onClick={(e) => handleMarkAsWatched(e, media.id)}
                        >
                            <img
                                className="icons"
                                src={eye}
                                alt="Mark media as watched"
                            />
                            Marks as watched
                        </Button>
                    )}

                    {/* If the media is in the watchlist and the user is verified, show the remove watched button */}

                    {isWatched && verified && (
                        <Button
                            className="watchButton"
                            onClick={(e) => handleRemoveAsWatched(e, media.id)}
                        >
                            <img
                                className="icons"
                                src={eyeClosed}
                                alt="Mark media as not watched"
                            />
                            Marks as not watched
                        </Button>
                    )}

                    {/* If the media is not in the watchlist and the user is verified, show the add to watchlist button */}
                    {!isInWatchlist && verified && (
                        <Button
                            className="addButton"
                            onClick={(e) => handleAddToWatchlist(e, media)}
                        >
                            <img
                                className="icons"
                                src={plus}
                                alt="Add media to watchlist"
                            />
                            Add to watchlist
                        </Button>
                    )}
                    {/* If the media is in the watchlist and the user is verified, show the remove from watchlist button */}
                    {isInWatchlist && verified && (
                        <Button
                            className="addButton"
                            onClick={(e) => handleRemoveFromWatchlist(e, media)}
                        >
                            <img
                                className="icons"
                                src={minus}
                                alt="Remove media from watchlist"
                            />
                            Remove from watchlist
                        </Button>
                    )}
                </div>

                {/* Display the media poster image */}
                <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                    alt={media.title}
                />

                {/* Display the media title */}
                <div className={styles.mediaDetails}>
                    <h3 className={styles.mediaTitle}>
                        {media.title || media.name}
                    </h3>
                    <span className={styles.mediaRating}>
                        <div className={styles.ratingContainer}>
                            <img
                                className="icons"
                                src={solidStar}
                                alt="Rating Icon"
                            />
                            <b>
                                {media.vote_average
                                    ? media.vote_average.toFixed(1)
                                    : "N/A"}
                            </b>
                        </div>
                        {verified && hasLinkedAccount && (
                            <Button
                                className="voteButton"
                                onClick={handleOnClickVote}
                                disabled={!isWatched}
                            >
                                Vote
                            </Button>
                        )}
                    </span>
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

export default Card;
