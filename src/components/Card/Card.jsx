import styles from "./Card.module.css";
import Button from "../Button/Button";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";
import { useContext } from "react";

const Card = ({ media, onCardClick, isInWatchlist, setWatchlist }) => {
    const { createWatchList, removeFromWatchList } = useWatchList();
    const { user } = useContext(authContext);

    const handleAddToWatchlist = async (e, media) => {
        e.stopPropagation();

        await createWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: [...(prev?.[media.media_type] || null), media.id],
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
            className={styles.card}
            onClick={() => onCardClick(media.id, media.media_type)}
        >
            {!isInWatchlist && (
                <Button
                    className="addButton"
                    onClick={(e) => handleAddToWatchlist(e, media)}
                >
                    +
                </Button>
            )}

            {isInWatchlist && (
                <Button
                    className="addButton"
                    onClick={(e) => handleRemoveFromWatchlist(e, media)}
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
