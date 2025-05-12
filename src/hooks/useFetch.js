import { useEffect, useState } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
            },
            signal: controller.signal,
        };

        const fetchData = async () => {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                setData(data);
                setError(null);
            } catch (error) {
                throw new Error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (url) {
            setIsLoading(true);
            fetchData();
            return () => {
                controller.abort();
            };
        }
    }, [url]);

    return { data, error, isLoading };
};
