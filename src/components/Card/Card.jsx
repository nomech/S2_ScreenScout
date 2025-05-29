import styles from "./Card.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";
import { useContext } from "react";
import minus from "../../assets/icons/minus.svg";
import plus from "../../assets/icons/plus.svg";
import eye from "../../assets/icons/eye.svg";
import eyeClosed from "../../assets/icons/eye-closed.svg";

const Card = ({
    media,
    onCardClick,
    isInWatchlist,
    setWatchlist,
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
            [mediaType]: [...(prev?.[mediaType] || null), media.id],
        }));
    };

    const handleRemoveFromWatchlist = async (e, media) => {
        e.stopPropagation();
        await removeFromWatchList(user.uid, media.id, mediaType);

        setWatchlist((prev) => ({
            ...prev,
            [mediaType]: prev?.[mediaType].filter((item) => {
                return item.id ? item.id !== media.id : item !== media.id;
            }),
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

    return (
        <div
            className={styles.card}
            onClick={() => onCardClick(media.id, mediaType)}
        >
            {!isWatched && verified && (
                <Button
                    className="watchButton"
                    onClick={(e) => handleMarkAsWatched(e, media.id)}
                >
                    <img className="icons" src={eye} alt="Mark watched" />
                </Button>
            )}
            {isWatched && verified && (
                <Button
                    className="watchButton"
                    onClick={(e) => handleRemoveAsWatched(e, media.id)}
                >
                    <img className="icons" src={eyeClosed} alt="Mark watched" />
                </Button>
            )}
            {!isInWatchlist && verified && (
                <Button
                    className="addButton"
                    onClick={(e) => handleAddToWatchlist(e, media)}
                >
                    <img className="icons" src={plus} alt="Add icon" />
                </Button>
            )}
            {isInWatchlist && verified && (
                <Button
                    className="addButton"
                    onClick={(e) => handleRemoveFromWatchlist(e, media)}
                >
                    <img className="icons" src={minus} alt="Remove icon" />
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
