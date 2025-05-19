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

const Watchlist = () => {
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");
    const [watchlist, setWatchlist] = useState(null);
    const [cardStyle, setCardStyle] = useState("Grid");

    const { user } = useContext(authContext);
    const { removeFromWatchList, getWatchList } = useWatchList();

    const hasFetched = useRef(false);

    useEffect(() => {
        const constructUrlList = async () => {
            if (!user || hasFetched.current) {
                return;
            }

            hasFetched.current = true;
            const list = await getWatchList(user.uid);
            const urlList = { tv: [], movie: [] };

            for (const key in list) {
                list[key].forEach((item) => {
                    const url = `https://api.themoviedb.org/3/${key}/${item}?language=en-US`;
                    urlList[key].push(url);
                });
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
    }, [user, getWatchList]);

    const handleRemoveFromWatchlist = async (e, media) => {
        e.stopPropagation();
        await removeFromWatchList(user.uid, media.id, media.media_type);
        setWatchlist((prev) => ({
            ...prev,
            [media.media_type]: prev?.[media.media_type].filter((item) => {
                return item.id !== media.id;
            }),
        }));
    };

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

    return (
        <>
            <div className="wrapper">
                {!watchlist && <Loading />}
                <div className={styles.button}>
                    <Button onClick={handleOnClickMediaButton}>Movie</Button>
                    <Button onClick={handleOnClickMediaButton}>TV</Button>
                    <Button
                        className="gridButton"
                        onClick={() => setCardStyle("Grid")}
                    >
                        <img
                            className={styles.gridIcon}
                            src={gridIcon}
                            alt="Grid"
                        />
                    </Button>
                    <Button
                        className="listButton"
                        onClick={() => setCardStyle("List")}
                    >
                        <img
                            className={styles.listIcon}
                            src={listIcon}
                            alt="List"
                        />
                    </Button>
                </div>
                <div className={styles.watchlistContainer}>
                    {watchlist &&
                        watchlist[mediaType].map((media) => {
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
