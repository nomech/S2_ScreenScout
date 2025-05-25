import { useContext, useEffect, useRef, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import DetailedCard from "../DetailedCard/DetailedCard";
import { authContext } from "../../context/authContext";
import { useWatchList } from "../../hooks/useWatchList";
import Card from "../Card/Card";
import ListCard from "../ListCard.jsx/ListCard";
import GenreContext from "../../context/GenreContext";

const MediaGrid = ({ limit, title, setMatches, getTotalPages, url }) => {
    const [cardStyle, setCardStyle] = useState("Grid");
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [watchlist, setWatchlist] = useState(null);
    const [watchedMedia, setWatchedMedia] = useState(null);

    const { data, isLoading } = useFetch(url);
    const { setDefaultWatchList, getWatchList } = useWatchList();

    const { user } = useContext(authContext);
    const { movieGenres, tvGenres } = useContext(GenreContext);

    const hasFetched = useRef(false);

    console.log(data);

    useEffect(() => {
        if (!user || hasFetched.current) return;
        hasFetched.current = true;

        const fetchWatchlist = async () => {
            try {
                const watchListData = await getWatchList(user.uid);
                setWatchlist(watchListData);
                setWatchedMedia(watchListData.watched);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };

        fetchWatchlist();
    }, [user, getWatchList]);

    useEffect(() => {
        if (!user) return;
        const initDefaultWatchlist = async () => {
            try {
                await setDefaultWatchList(user.uid);
            } catch (error) {
                console.error("Error initializing default watchlist:", error);
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

    const setWatchedStatus = (item) => {
        return watchedMedia ? watchedMedia.includes(item.id) : false;
    };

    const filterItemsByFilterParams = (items, filterParams) => {
        if (!filterParams) {
            return items;
        }
        console.log(filterParams.genre);
        items.filter((item) => {
            return item.genre_ids.includes(parseInt(filterParams.genre));
        });

        console.log(items);

        return items;
    };

    const toggleWatchStatus = (id) => {
        setWatchedMedia((previous) =>
            previous
                ? previous.includes(id)
                    ? previous.filter((item) => item !== id)
                    : [...previous, id]
                : [id]
        );
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

    const items = filterItemsByFilterParams(
        (data?.results || [])
            .filter((media) => media.media_type !== "person")
            .map((media) => {
                media.watched = setWatchedStatus(media);
                return media;
            })
    );

    return (
        <>
            {isLoading && <Loading />}

            <div className={styles.mediaGridContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.buttonContainer}>
                        <Button
                            className="gridButton"
                            onClick={() => setCardStyle("Grid")}
                        >
                            <img className="icons" src={gridIcon} alt="Grid" />
                        </Button>
                        <Button
                            className="listButton"
                            onClick={() => setCardStyle("List")}
                        >
                            <img className="icons" src={listIcon} alt="List" />
                        </Button>
                    </div>
                </div>

                <div
                    className={`${styles.mediaGrid} ${
                        styles["container" + cardStyle]
                    }`}
                >
                    {items
                        .slice(0, limit)
                        .map((media) =>
                            cardStyle === "Grid" ? (
                                <Card
                                    key={media.id}
                                    isInWatchlist={watchlist?.[
                                        media.media_type
                                    ]?.includes(media.id)}
                                    isWatched={watchedMedia?.includes(media.id)}
                                    media={media}
                                    watchlist={watchlist}
                                    onCardClick={handleCardClick}
                                    setWatchlist={setWatchlist}
                                    toggleWatchStatus={toggleWatchStatus}
                                />
                            ) : (
                                <ListCard
                                    key={media.id}
                                    media={media}
                                    user={user}
                                    isInWatchlist={watchlist[
                                        media.media_type
                                    ].includes(media.id)}
                                    isWatched={watchedMedia?.includes(media.id)}
                                    onCardClick={handleCardClick}
                                    setWatchlist={setWatchlist}
                                    toggleWatchStatus={toggleWatchStatus}
                                />
                            )
                        )}
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
