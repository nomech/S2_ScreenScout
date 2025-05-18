import styles from "./WatchlistGrid.module.css";
import Card from "../Card/Card";
import { useWatchList } from "../../hooks/useWatchList";
import Loading from "../Loading/Loading";
import { useContext, useState } from "react";
import { authContext } from "../../context/authContext";

const Watchlist = ({ data }) => {
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");

    const { user } = useContext(authContext);

    const { removeFromWatchList } = useWatchList();

    const handleRemoveFromWatchlist = async (e, media) => {
        console.log(media);
        e.stopPropagation();
        await removeFromWatchList(user.uid, media.id, mediaType);
    };

    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    return (
        <div className="wrapper">
            {!data && <Loading />}
            <div className={styles.watchlistContainer}>
                {data &&
                    data.movie.map((media) => {
                        return (
                            <Card
                                key={media.id}
                                media={media}
                                onCardClick={handleCardClick}
                                onRemoveFromWatchlist={
                                    handleRemoveFromWatchlist
                                }
                                isInWatchlist={true}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default Watchlist;
