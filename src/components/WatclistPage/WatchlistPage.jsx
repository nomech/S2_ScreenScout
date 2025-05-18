import React, { useContext, useEffect, useRef, useState } from "react";
import { useWatchList } from "../../hooks/useWatchList";
import { authContext } from "../../context/authContext";

const WatchlistPage = () => {
    const [watchlistData, setWatchlistData] = useState(null);

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
            setWatchlistData(mediaList);
        };

        constructUrlList();
    }, [user, getWatchList]);

    return <></>;
};

export default WatchlistPage;
