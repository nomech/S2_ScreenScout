import { useEffect, useState } from "react";

// Custom hook to fetch data from a given URL
export const useFetch = (url) => {
    // State variables to hold data, error, and loading status
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Effect to fetch data from the provided URL
    useEffect(() => {
        // AbortController to cancel fetch requests if the component unmounts
        const controller = new AbortController();

        // Options for the fetch request, including method, headers, and signal for aborting
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${import.meta.env.VITE_APP_TMDB_TOKEN}`,
            },
            signal: controller.signal,
        };

        // Function to fetch data from the URL
        const fetchData = async () => {
            try {
                // Fetch data from the URL with the specified options
                const response = await fetch(url, options);
                // Check if the response is ok (status in the range 200-299)
                if (!response.ok) {
                    setError("Failed to fetch data from the API");
                    throw new Error("Network response was not ok, please contact support if the issue persists.");
                }
                // Parse the response data as JSON
                const data = await response.json();
                // Update state with the fetched data and reset error
                setData(data);
                setError(null);
            } catch (error) {
                // If the fetch is aborted, ignore the error
                setError(error.message);
                throw new Error(error);
            } finally {
                // Set loading state to false after fetch completes
                setIsLoading(false);
            }
        };

        // If a URL is provided, start fetching data
        if (url) {
            //  Set loading state to true before starting the fetch
            setIsLoading(true);
            fetchData();
            // Cleanup function to abort the fetch request if the component unmounts
            return () => {
                controller.abort();
            };
        }
    }, [url]);

    // Return the fetched data, any error encountered, and the loading state
    return { data, error, isLoading };
};
