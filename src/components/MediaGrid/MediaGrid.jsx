import React, { useEffect, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";

const MediaGrid = ({ limit, title, setMatches, getTotalPages, url }) => {
    const { data, isLoading } = useFetch(url);
    const [cardStyle, setCardStyle] = useState("List");

    const items = (data?.results || []).filter(
        (media) => media.media_type !== "person"
    );
    useEffect(() => {
        if (setMatches && data && !isLoading) {
            setMatches(data.total_results);
            getTotalPages(data.total_pages);
        }
    }, [setMatches, getTotalPages, data, isLoading]);

    const setListStyle = () => {
        setCardStyle("List");
    };

    const setGridStyle = () => {
        setCardStyle("Grid");
    };

    console.log(data);
    return (
        <>
            {isLoading && <Loading />}

            <div className={styles.mediaGridContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{title}</h1>
                    <Button onClick={setGridStyle}>Grid</Button>
                    <Button onClick={setListStyle}>List</Button>
                </div>
                <div
                    className={`${styles.mediaGrid} ${
                        styles["container" + cardStyle]
                    }`}
                >
                    {data &&
                        cardStyle === "Grid" &&
                        items?.media_type != "person" &&
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={`${styles.card} ${
                                    styles["card" + cardStyle]
                                }`}
                            >
                                <img
                                    className="poster"
                                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                                    alt={media.title}
                                />
                                <div className="media-details">
                                    <h3 className={styles.mediaTitle}>
                                        {media.title} {media.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    {data &&
                        cardStyle === "List" &&
                        items?.media_type != "person" &&
                        items.slice(0, limit).map((media) => (
                            <div
                                key={media.id}
                                className={`${styles["card" + cardStyle]}`}
                            >
                                <img
                                    className={styles.backdrop}
                                    src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                                />
                                <div className={`${styles.card}`}>
                                    <img
                                        className={styles.poster}
                                        src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                                        alt={media.title}
                                    />
                                    <p className={styles.id}>ID: {media.id}</p>
                                    <div className={styles.mediaDetails}>
                                        <h3 className={styles.mediaTitle}>
                                            {media.title} {media.name}
                                        </h3>
                                        <p>
                                            {media.release_date}
                                            {media.first_air_date}
                                        </p>
                                        <p>{media.genre_ids}</p>
                                        <p>{media.overview}</p>
                                        <p>
                                            {Math.round(media.vote_average)}
                                            /10
                                        </p>
                                        <p>{media.vote_count} votes</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default MediaGrid;
