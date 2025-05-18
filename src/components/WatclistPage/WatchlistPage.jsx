import { useContext, useEffect, useRef, useState } from "react";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";
import WatchlistGrid from "../WatchlistGrid/WatchlistGrid";

const WatchlistPage = () => {
    const [showDetailedCard, setShowDetailedCard] = useState(false);
    const [detailedCardId, setDetailedCardId] = useState(null);
    const [mediaType, setMediaType] = useState("movie");
    const [watchlistData, setWatchlistData] = useState(null);
    const [watchlist, setWatchlist] = useState(null);
    const { getWatchList } = useWatchList();
    const { user } = useContext(authContext);
    const hasFetched = useRef(false);

    useEffect(() => {
        const constructUrlList = async () => {
            if (!user || hasFetched.current) {
                return;
            }

            hasFetched.current = true;
            const list = await getWatchList(user.uid);
            setWatchlist(list);
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
                    return await response.json();
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
            console.log(mediaList);

            setWatchlistData(mediaList);
        };

        constructUrlList();
    }, [user, getWatchList]);

    const handleCardClick = (id, media) => {
        setDetailedCardId(id);
        setMediaType(media);
        setShowDetailedCard(true);
    };

    return (
        <WatchlistGrid
            data={watchlistData}
            onCardClick={handleCardClick}
            watchlist={watchlist}
        />
    );
};

export default WatchlistPage;
