import styles from "./WatchlistGrid.module.css";
import Card from "../Card/Card";
import { useWatchList } from "../../hooks/useWatchList";
import Loading from "../Loading/Loading";
import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from "../../context/authContext";
import Button from "../Button/Button";
import DetailedCard from "../DetailedCard/DetailedCard";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import ListCard from "../ListCard.jsx/ListCard";

const Watchlist = () => {
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");
    const [cardStyle, setCardStyle] = useState("Grid");
    const [watchlist, setWatchlist] = useState(null);
    const [watchedMedia, setWatchedMedia] = useState(null);

    const { user } = useContext(authContext);
    const { getWatchList, getWatchedMedia } = useWatchList();
    const hasFetched = useRef(false);

    useEffect(() => {
        const constructUrlList = async () => {
            if (!user || hasFetched.current) {
                return;
            }

            hasFetched.current = true;
            const list = await getWatchList(user.uid);
            setWatchedMedia(list.watched);

            const urlList = { tv: [], movie: [] };
            for (const key in list) {
                if (key !== "watched") {
                    list[key].forEach((item) => {
                        const url = `https://api.themoviedb.org/3/${key}/${item}?language=en-US`;
                        urlList[key].push(url);
                    });
                }
            }

            const controller = new AbortController();
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
                },
                signal: controller.signal,
            };

            const fetchData = async (url) => {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    if (Object.hasOwn(data, "number_of_episodes")) {
                        data.media_type = "tv";
                    } else {
                        data.media_type = "movie";
                    }

                    data.watched = watchedMedia?.includes(data.id)
                        ? true
                        : false;
                    return data;
                } catch (error) {
                    throw new Error(error);
                }
            };

            const mediaList = { tv: [], movie: [] };
            for (const key in urlList) {
                for (const url of urlList[key]) {
                    const data = await fetchData(url);
                    mediaList[key].push(data);
                }
            }
            setWatchlist(mediaList);
        };

        constructUrlList();
    }, [user, getWatchList, getWatchedMedia, watchedMedia]);

    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    const handleOnClickMediaButton = (e) => {
        setMediaType(e.target.innerText.toLowerCase());
    };

    const handleCloseDetailedCard = () => {
        setShowDetailedCard(false);
        setDetailedCardId(null);
    };

    const toggleWatchStatus = (id) => {
        console.log(id);

        setWatchedMedia((previous) =>
            previous
                ? previous.includes(id)
                    ? previous.filter((item) => item !== id)
                    : [...previous, id]
                : [id]
        );
    };

    return (
        <>
            <div className="wrapper">
                {!watchlist && <Loading />}
                {watchlist && watchlist[mediaType].length === 0 && (
                    <div className={styles.emptyWatchlist}>
                        <h2 className={styles.emptyTitle}>
                            Your {mediaType} watchlist is empty
                        </h2>
                        <p className={styles.emptyText}>
                            Add movies and TV shows to your watchlist to see
                            them here.
                        </p>
                    </div>
                )}

                <div className={styles.watchlistContainer}>
                    <div className={styles.buttons}>
                        <div className={styles.filterButtons}>
                            {watchlist && watchlist.movie.length > 0 && (
                                <Button
                                    onClick={handleOnClickMediaButton}
                                    className={
                                        mediaType == "movie"
                                            ? "active"
                                            : "inactive"
                                    }
                                >
                                    Movie
                                </Button>
                            )}
                            {watchlist && watchlist.tv.length > 0 && (
                                <Button
                                    onClick={handleOnClickMediaButton}
                                    className={
                                        mediaType == "tv"
                                            ? "active"
                                            : "inactive"
                                    }
                                >
                                    TV
                                </Button>
                            )}
                        </div>

                        <div className={styles.styleButtons}>
                            <Button
                                className="gridButton"
                                onClick={() => setCardStyle("Grid")}
                            >
                                <img
                                    className="icons"
                                    src={gridIcon}
                                    alt="Grid"
                                />
                            </Button>
                            <Button
                                className="listButton"
                                onClick={() => setCardStyle("List")}
                            >
                                <img
                                    className="icons"
                                    src={listIcon}
                                    alt="List"
                                />
                            </Button>
                        </div>
                    </div>
                    <div
                        className={`${styles.watchlist} ${
                            styles["container" + cardStyle]
                        }`}
                    >
                        {watchlist &&
                            watchlist[mediaType].map((media) =>
                                cardStyle === "Grid" ? (
                                    <Card
                                        key={media.id}
                                        media={media}
                                        onCardClick={handleCardClick}
                                        isInWatchlist={true}
                                        setWatchlist={setWatchlist}
                                        isWatched={watchedMedia?.includes(
                                            media.id
                                        )}
                                        toggleWatchStatus={toggleWatchStatus}
                                    />
                                ) : (
                                    <ListCard
                                        key={media.id}
                                        media={media}
                                        user={user}
                                        isWatched={watchedMedia.includes(
                                            media.id
                                        )}
                                        isInWatchlist={true}
                                        onCardClick={handleCardClick}
                                        setWatchlist={setWatchlist}
                                        toggleWatchStatus={toggleWatchStatus}
                                    />
                                )
                            )}
                    </div>
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

export default Watchlist;
