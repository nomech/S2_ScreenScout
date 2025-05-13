import React, { useEffect, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import DetailedCard from "../DetailedCard/DetailedCard";

const MediaGrid = ({ limit, title, setMatches, getTotalPages, url }) => {
    const { data, isLoading } = useFetch(url);
    const [cardStyle, setCardStyle] = useState("Grid");
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    const items = (data?.results || []).filter(
        (media) => media.media_type !== "person"
    );
    useEffect(() => {
        if (setMatches && data && !isLoading) {
            setMatches(data.total_results);
            getTotalPages(data.total_pages);
        }
    }, [setMatches, getTotalPages, data, isLoading]);

    const setListStyle = () => {
        setCardStyle("List");
    };

    const setGridStyle = () => {
        setCardStyle("Grid");
    };

    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    const handleCloseDetailedCard = () => {
        setShowDetailedCard(false);
        setDetailedCardId(null);
    };

    console.log(data);

    return (
        <>
            {isLoading && <Loading />}

            <div className={styles.mediaGridContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.butonContiner}>
                        <Button className="listButton" onClick={setGridStyle}>
                            <img className={styles.gridIcon} src={gridIcon} />
                        </Button>
                        <Button className="gridButton" onClick={setListStyle}>
                            <img className={styles.listIcon} src={listIcon} />
                        </Button>
                    </div>
                </div>
                <div
                    className={`${styles.mediaGrid} ${
                        styles["container" + cardStyle]
                    }`}
                >
                    {data &&
                        cardStyle === "Grid" &&
                        items?.media_type != "person" &&
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={`${styles.card}`}
                                onClick={() =>
                                    handleCardClick(media.id, media.media_type)
                                }
                            >
                                <img
                                    className="poster"
                                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                                    alt={media.title}
                                />
                                <div className="media-details">
                                    <h3 className={styles.mediaTitle}>
                                        {media.title} {media.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    {data &&
                        cardStyle === "List" &&
                        items?.media_type != "person" &&
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={`${styles["card" + cardStyle]}`}
                            >
                                <img
                                    className={styles.backdrop}
                                    src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                                />
                                <div className={`${styles.card}`}>
                                    <img
                                        className={styles.poster}
                                        src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                                        alt={media.title}
                                    />
                                    <p className={styles.id}>ID: {media.id}</p>
                                    <div className={styles.mediaDetails}>
                                        <h3 className={styles.mediaTitle}>
                                            {media.title} {media.name}
                                        </h3>
                                        <div className={styles.macroData}>
                                            <p className={styles.release}>
                                                {media.release_date}
                                                {media.first_air_date}
                                            </p>
                                            {media.genre_ids.map((genre) => {
                                                return (
                                                    <p
                                                        key={genre}
                                                        className={styles.genre}
                                                    >
                                                        {genre}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                        <p className={styles.overview}>
                                            {media.overview}
                                        </p>
                                        <div className={styles.votes}>
                                            <p>
                                                {Math.round(media.vote_average)}
                                                /10
                                            </p>
                                            <p>
                                                {media.vote_count} people voted
                                            </p>
                                        </div>
                                        <Button className="watchlistButton">
                                            Add to Watchlist
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {showDetailedCard && (
                <DetailedCard
                    id={detailedCardId}
                    mediaType={mediaType}
                    onClose={handleCloseDetailedCard}
                />
            )}
        </>
    );
};

export default MediaGrid;
