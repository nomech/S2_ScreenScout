import styles from "./WatchlistGrid.module.css";
import Card from "../Card/Card";
import { useWatchList } from "../../hooks/useWatchList";
import Loading from "../Loading/Loading";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "../Button/Button";
import DetailedCard from "../DetailedCard/DetailedCard";
import listIcon from "../../assets/icons/listIcon.svg";
import gridIcon from "../../assets/icons/gridIcon.svg";
import ListCard from "../ListCard.jsx/ListCard";
import tv from "../../assets/icons/tv.svg";
import film from "../../assets/icons/film.svg";
import { checkSessionId } from "../../utils/linkAccountwithTmdb";

// This component renders a watchlist of movies and TV shows, allowing users to view details, mark items as watched, and toggle their watchlist status.
const Watchlist = () => {
    // State variables to manage the watchlist, detailed card visibility, media type, card style, and watched media
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");
    const [cardStyle, setCardStyle] = useState("Grid");
    const [watchlist, setWatchlist] = useState(null);
    const [watchedMedia, setWatchedMedia] = useState(null);
    const [hasLinkedAccount, setHasLinkedAccount] = useState(false);

    // Context to access user authentication
    const { user } = useContext(AuthContext);

    // Custom hook to fetch the watchlist and watched media
    const { getWatchList, getWatchedMedia } = useWatchList();

    // Ref to track if the watchlist has been fetched to avoid multiple fetches
    const hasFetched = useRef(false);

    // Effect to fetch the watchlist and watched media when the component mounts or when the user changes
    useEffect(() => {
        // Function to construct the URL list for fetching media details
        const constructUrlList = async () => {
            if (!user || hasFetched.current) {
                return;
            }

            // Set the flag to indicate that the watchlist has been fetched
            hasFetched.current = true;
            const list = await getWatchList(user.uid);

            setWatchedMedia(list.watched);

            // Create a list of URLs for fetching media details
            const urlList = { tv: [], movie: [] };
            for (const key in list) {
                if (key !== "watched" && key !== "sessionId") {
                    list[key].forEach((item) => {
                        const url = `https://api.themoviedb.org/3/${key}/${item}?language=en-US`;
                        urlList[key].push(url);
                    });
                }
            }

            // Set controller to handle fetch requests
            const controller = new AbortController();

            // Options for the fetch request, including headers and signal for aborting
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
                },
                signal: controller.signal,
            };

            // Function to fetch data from the constructed URLs
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

                    // Add watched status to the media data
                    data.watched = watchedMedia?.includes(data.id)
                        ? true
                        : false;
                    return data;
                } catch (error) {
                    throw new Error(error);
                }
            };

            // Fetch data for each URL and construct the watchlist object
            const mediaList = { tv: [], movie: [] };
            for (const key in urlList) {
                for (const url of urlList[key]) {
                    const data = await fetchData(url);
                    mediaList[key].push(data);
                }
            }

            // Set the watchlist state with the fetched media list
            setWatchlist(mediaList);
        };

        constructUrlList();
    }, [user, getWatchList, getWatchedMedia, watchedMedia]);

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

    // Function to handle card click events, setting the detailed card ID and media type, and showing the detailed card
    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    // Function to handle media type
    const handleOnClickMediaButton = (e) => {
        setMediaType(e.currentTarget.innerText.toLowerCase());
    };

    // Function to handle closing the detailed card
    const handleCloseDetailedCard = () => {
        setShowDetailedCard(false);
        setDetailedCardId(null);
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

    return (
        <>
            <div>
                {/* Conditional rendering for loading state and empty watchlist message */}
                {!watchlist && <Loading />}

                {/* Conditional rendering for empty watchlist message */}
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

                {/* Watchlist container with buttons for filtering media type and changing card style */}
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
                                    <img
                                        className="icons"
                                        src={film}
                                        alt="Movie Icon"
                                    />
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
                                    <img
                                        className="icons"
                                        src={tv}
                                        alt="Tv Icon"
                                    />
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
                        {/* Render media cards based on the selected card style */}
                        {watchlist &&
                            watchlist[mediaType].map((media) =>
                                cardStyle === "Grid" ? (
                                    <Card
                                        key={media.id}
                                        media={media}
                                        mediaType={mediaType}
                                        onCardClick={handleCardClick}
                                        isInWatchlist={true}
                                        setWatchlist={setWatchlist}
                                        isWatched={watchedMedia?.includes(
                                            media.id
                                        )}
                                        toggleWatchStatus={toggleWatchStatus}
                                        hasLinkedAccount={hasLinkedAccount}
                                    />
                                ) : (
                                    <ListCard
                                        key={media.id}
                                        media={media}
                                        user={user}
                                        mediaType={mediaType}
                                        isWatched={watchedMedia.includes(
                                            media.id
                                        )}
                                        isInWatchlist={true}
                                        onCardClick={handleCardClick}
                                        setWatchlist={setWatchlist}
                                        toggleWatchStatus={toggleWatchStatus}
                                        hasLinkedAccount={hasLinkedAccount}
                                    />
                                )
                            )}
                    </div>
                </div>
            </div>

            {/* Render the detailed card if showDetailedCard is true */}
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
