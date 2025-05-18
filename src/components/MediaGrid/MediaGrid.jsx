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
        if (!user) return;

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
                    <div className={styles.buttonContainer}>
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
                                    media={media}
                                    watchlist={watchlist}
                                    onCardClick={handleCardClick}
                                    onAddToWatchlist={handleAddToWatchlist}
                                    onRemoveFromWatchlist={
                                        handleRemoveFromWatchlist
                                    }
                                />
                            ) : (
                                <ListCard
                                    key={media.id}
                                    media={media}
                                    user={user}
                                    onAddToWatchlist={setWatchList}
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
