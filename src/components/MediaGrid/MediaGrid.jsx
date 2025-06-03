import { useEffect, useRef, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import DetailedCard from "../DetailedCard/DetailedCard";
import { getAuthContext } from "../../context/authContext";
import { useWatchList } from "../../hooks/useWatchList";
import Card from "../Card/Card";
import ListCard from "../ListCard.jsx/ListCard";
import { getGenreContext } from "../../context/genreContext";
import { checkSessionId } from "../../utils/linkAccountwithTmdb";

// This component renders a grid of media items (movies or TV shows) with options to view details and manage watchlists.
const MediaGrid = ({
    limit = 20,
    title,
    setMatches,
    getTotalPages,
    tv = false,
    movie = false,
    url,
}) => {
    // State variables to manage the grid style, detailed card visibility, and media type
    const [cardStyle, setCardStyle] = useState("Grid");
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");
    const [watchlist, setWatchlist] = useState(null);
    const [watchedMedia, setWatchedMedia] = useState(null);
    const [hasLinkedAccount, setHasLinkedAccount] = useState(false);

    // Custom hook to fetch data from the provided URL
    const { data, isLoading, error } = useFetch(url);

    // Importing functions from the useWatchList hook to manage watchlist actions
    const { setDefaultWatchList, getWatchList } = useWatchList();

    // Contexts to access user authentication and genre data
    const { user } = getAuthContext();
    const { movieGenres, tvGenres } = getGenreContext();

    // Ref to track if the watchlist has been fetched to avoid multiple fetches
    const hasFetched = useRef(false);

    useEffect(() => {
        // Fetch the watchlist only once when the user is authenticated
        if (!user || hasFetched.current) {
            return;
        }

        // Set the flag to indicate that the watchlist has been fetched
        hasFetched.current = true;

        // Function to fetch the watchlist and watched media
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

    // Effect to initialize the default watchlist when the user is authenticated
    useEffect(() => {
        if (!user) {
            return;
        }
        const initDefaultWatchlist = async () => {
            try {
                await setDefaultWatchList(user.uid);
            } catch (error) {
                console.error("Error initializing default watchlist:", error);
            }
        };
        console.log(user);

        initDefaultWatchlist();
    }, [setDefaultWatchList, user]);

    // Effect to update matches and media type when data is loaded
    useEffect(() => {
        // If setMatches is provided, update the total matches and total pages
        if (setMatches && data && !isLoading) {
            setMatches(data.total_results);
            getTotalPages(data.total_pages);
        }

        // Determine the media type based on the provided props
        if (movie) {
            setMediaType("movie");
        } else if (tv) {
            setMediaType("tv");
        }
    }, [setMatches, getTotalPages, data, isLoading, setMediaType, movie, tv]);

    // Effect to check if the user's account is linked with TMDB
    useEffect(() => {
        // Function to check if the user's account is linked
        const checkIfAccountIsLinked = async () => {
            console.log("Checking if account is linked for user:", user);
            const sessionId = await checkSessionId(user.uid);
            console.log("Session ID for user:", user, "is", sessionId);
            if (!sessionId) {
                // If no session ID is found, set hasLinkedAccount to false
                // This indicates that the user has not linked their account with TMDB
                console.error("No session ID found for user:", user);
                setHasLinkedAccount(false);
            } else {
                // If a session ID is found, set hasLinkedAccount to true
                setHasLinkedAccount(true);
            }
            console.log("Has linked account:", hasLinkedAccount);
        };

        if (user) {
            checkIfAccountIsLinked();
        }
    }, [hasLinkedAccount, user]);

    // Function to check if a media item is watched based on its ID
    const setWatchedStatus = (item) => {
        return watchedMedia ? watchedMedia.includes(item.id) : false;
    };

    // Function to toggle the watch status of a media item
    const toggleWatchStatus = (id) => {
        setWatchedMedia((previous) =>
            previous
                ? previous.includes(id)
                    ? previous.filter((item) => item !== id)
                    : [...previous, id]
                : [id]
        );
    };

    // Function to handle card click events, showing the detailed card view
    const handleCardClick = (id, type) => {
        setDetailedCardId(id);
        setMediaType(type);
        setShowDetailedCard(true);
    };

    // Function to close the detailed card view
    const handleCloseDetailedCard = () => {
        setShowDetailedCard(false);
        setDetailedCardId(null);
    };

    // Filter and map the media items from the fetched data
    const items = (data?.results || [])
        .filter((media) => media.media_type !== "person")
        .map((media) => {
            media.watched = setWatchedStatus(media);
            // Map genre IDs to genre names based on the media type
            if (media.media_type === "movie" && movieGenres) {
                media.genres = media.genre_ids.map((id) => {
                    const matchedGenre = movieGenres.find(
                        (genre) => genre.id === id
                    );
                    return matchedGenre?.name;
                });
            } else if (media.media_type === "tv" && tvGenres) {
                media.genres = media.genre_ids.map((id) => {
                    const matchedGenre = tvGenres.find(
                        (genre) => genre.id === id
                    );
                    return matchedGenre?.name;
                });
            }

            return media;
        });

    return (
        <>
            {/* Render loading state while data is being fetched */}
            {isLoading && <Loading />}
            {/* Render error message if there is an error fetching data */}
            {error && (
                <div className={styles.error}>
                    <p>Error: {error}</p>
                </div>
            )}

            {/* Render the media grid container with title and buttons for grid/list view */}
            <section className={styles.mediaGridContainer}>
                <header className={styles.header}>
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
                </header>

                {/* Render the media items in a grid or list format based on the selected card style */}
                <section
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
                                    mediaType={mediaType}
                                    isInWatchlist={watchlist?.[
                                        mediaType
                                    ]?.includes(media.id)}
                                    isWatched={watchedMedia?.includes(media.id)}
                                    media={media}
                                    watchlist={watchlist}
                                    onCardClick={handleCardClick}
                                    setWatchlist={setWatchlist}
                                    toggleWatchStatus={toggleWatchStatus}
                                    hasLinkedAccount={hasLinkedAccount}
                                />
                            ) : (
                                <ListCard
                                    key={media.id}
                                    media={media}
                                    user={user}
                                    mediaType={mediaType}
                                    isInWatchlist={watchlist[
                                        mediaType
                                    ].includes(media.id)}
                                    isWatched={watchedMedia?.includes(media.id)}
                                    onCardClick={handleCardClick}
                                    setWatchlist={setWatchlist}
                                    toggleWatchStatus={toggleWatchStatus}
                                    hasLinkedAccount={hasLinkedAccount}
                                />
                            )
                        )}
                </section>
            </section>

            {/* Render the detailed card view if it is set to be shown */}
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
