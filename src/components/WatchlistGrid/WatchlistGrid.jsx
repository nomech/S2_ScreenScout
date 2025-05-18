import React from "react";
import styles from "./WatchlistGrid.module.css";
import Card from "../Card/Card";
import Loading from "../Loading/Loading";

const watchlist = ({
    data,
    handleCardClick,
    handleRemoveFromWatchlist,
    watchlist,
}) => {
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
                                watchlist={watchlist}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default watchlist;
