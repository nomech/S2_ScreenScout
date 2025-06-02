import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import styles from "./Banner.module.css";
import Loading from "../Loading/Loading";

// This componenet is a banner that displays trending media from The Movie Database (TMDB).

const Banner = () => {
    // Fetches trending media data from TMDB API
    const { data, isLoading, error } = useFetch(
        "https://api.themoviedb.org/3/trending/all/week?language=en-US"
    );

    // State to keep track of the current index of the media being displayed
    const [currentIndex, setCurrentIndex] = useState(0);

    // Effect to change the current index every 5 seconds
    // It cycles through the media results to create a slideshow effect

    useEffect(() => {
        // If there are no results, do not set up the interval
        if (!data?.results?.length) {
            return;
        }

        // Set up an interval to change the current index every 5 seconds
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % data.results.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [data]);

    return (
        // The banner component displays the media in a slideshow format
        <section className={styles.banner} aria-label="Trending media carousel">
            {/* If the data is still loading, show a loading spinner */}
            {isLoading && <Loading />}
            {/* If there is an error fetching data, display the error message */}
            {error && (
                <div className={styles.error}>
                    <p>Error: {error}</p>
                </div>
            )}

            {/* Map through the media results and display each one */}
            {data &&
                data.results.map((media, index) => (
                    // Display each media item in a container
                    <article
                        key={media.id}
                        className={`${styles.mediaContainer} ${
                            index === currentIndex ? styles.activeSlide : ""
                        }`}
                    >
                        {/* If the media does not have a backdrop path, do not display the backdrop image */}
                        <div className={styles.backdrop}>
                            <img
                                className={styles.backdrop}
                                src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                                alt=""
                                aria-hidden="true"
                            />
                        </div>

                        {/* Display the media details such as poster, title, and overview */}
                        <div key={media.id} className={styles.mediaDetails}>
                            <figure>
                                <img
                                    className={styles.poster}
                                    src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
                                    alt={media.title}
                                />
                            </figure>
                            <div className={styles.description}>
                                <header>
                                    <h1 className={styles.title}>
                                        {media.title ? media.title : media.name}
                                    </h1>
                                </header>
                                <p className={styles.overview}>
                                    {media.overview}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
        </section>
    );
};

export default Banner;
