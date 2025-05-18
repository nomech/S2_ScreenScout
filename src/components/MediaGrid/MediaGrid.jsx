import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import DetailedCard from "../DetailedCard/DetailedCard";
import { authContext } from "../../context/authContext";
import { useWatchList } from "../../hooks/useWatchList";

const MediaGrid = ({ limit, title, setMatches, getTotalPages, url }) => {
    const [cardStyle, setCardStyle] = useState("Grid");
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [watchlist, setWatchlist] = useState(null);

    const { data, isLoading } = useFetch(url);
    const { user } = useContext(authContext);
    const {
        setDefaultWatchList,
        setWatchList,
        getWatchList,
        removeFromWatchList,
    } = useWatchList();

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!user || hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        const fetchWatchlist = async () => {
            try {
                const data = await getWatchList(user.uid);
                setWatchlist(data);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };

        fetchWatchlist();
    }, [user, getWatchList]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const initDefaultWatchlist = async () => {
            try {
                await setDefaultWatchList(user.uid);
            } catch (error) {
                console.error("Error fetching watchlist:", error);
            }
        };

        initDefaultWatchlist();
    }, [setDefaultWatchList, user]);

    useEffect(() => {
        if (setMatches && data && !isLoading) {
            setMatches(data.total_results);
            getTotalPages(data.total_pages);
        }
    }, [setMatches, getTotalPages, data, isLoading]);

    const items = (data?.results || []).filter(
        (media) => media.media_type !== "person"
    );

    const setListStyle = () => setCardStyle("List");
    const setGridStyle = () => setCardStyle("Grid");

    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    const handleCloseDetailedCard = () => {
        setShowDetailedCard(false);
        setDetailedCardId(null);
    };

    const handleAddToWatchlist = async (e, media) => {
        e.stopPropagation();
        await setWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: [...(prev?.[media.media_type] || []), media.id],
        }));
    };
    const handleRemoveFromWatchlist = async (e, media) => {
        e.stopPropagation();
        await removeFromWatchList(user.uid, media);
        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: prev?.[media.media_type].filter(
                (item) => item !== media.id
            ),
        }));
    };

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
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={styles.card}
                                onClick={() =>
                                    handleCardClick(media.id, media.media_type)
                                }
                            >
                                {data &&
                                    !watchlist?.[media.media_type].includes(
                                        media.id
                                    ) && (
                                        <Button
                                            className="addButton"
                                            onClick={(e) =>
                                                handleAddToWatchlist(e, media)
                                            }
                                        >
                                            +
                                        </Button>
                                    )}

                                {data &&
                                    watchlist?.[media.media_type].includes(
                                        media.id
                                    ) && (
                                        <Button
                                            className="addButton"
                                            onClick={(e) =>
                                                handleRemoveFromWatchlist(
                                                    e,
                                                    media
                                                )
                                            }
                                        >
                                            -
                                        </Button>
                                    )}

                                <img
                                    className="poster"
                                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                                    alt={media.title}
                                />
                                <div className="media-details">
                                    <h3 className={styles.mediaTitle}>
                                        {media.title || media.name}
                                    </h3>
                                </div>
                            </div>
                        ))}

                    {data &&
                        cardStyle === "List" &&
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={styles["card" + cardStyle]}
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
                                                {media.release_date ||
                                                    media.first_air_date}
                                            </p>
                                            {media.genre_ids.map((genre) => (
                                                <p
                                                    key={genre}
                                                    className={styles.genre}
                                                >
                                                    {genre}
                                                </p>
                                            ))}
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
                                        <Button
                                            className="watchlistButton"
                                            onClick={() =>
                                                setWatchList(user.uid, media)
                                            }
                                        >
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
