import React from "react";
import { useFetch } from "../../hooks/useFetch";
import styles from "./DetailedCard.module.css";
import Loading from "../Loading/Loading";
import Button from "../Button/Button";
import film from "../../assets/icons/film.svg";
import placeholder from "../../assets/images/placeholder.png";

const DetailedCard = ({ id, mediaType, onClose }) => {
    const movieUrl = `https://api.themoviedb.org/3/${mediaType}/${id}`;

    const {
        data: media,
        error: mediaError,
        isLoading: mediaIsLoading,
    } = useFetch(movieUrl);

    const creditsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/credits`;
    const {
        data: credits,
        error: creditsError,
        isLoading: creditsLoading,
    } = useFetch(creditsUrl);

    const getImgSrc = (path, size = "original") => {
        return path ? `https://image.tmdb.org/t/p/${size}${path}` : film;
    };
    
    return (
        <>
            {mediaIsLoading && (
                <div className={styles.backlay}>
                    <div className={styles.loadingContainer}>
                        <Button className="closeButton" onClick={onClose}>
                            X
                        </Button>
                        <Loading />
                    </div>
                </div>
            )}
            {mediaError && <p className={styles.error}>Error loading media</p>}
            {media && (
                <div className={styles.backlay}>
                    <div className={styles.detailedCardContainer}>
                        <Button className="closeButton" onClick={onClose}>
                            X
                        </Button>
                        <img
                            className={styles.backdrop}
                            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                            alt={media.title}
                        />
                        <div className={styles.overlay}>
                            <div className={styles.detailsContainer}>
                                <img
                                    className={styles.poster}
                                    src={getImgSrc(media.poster_path, "w300")}
                                    alt={media.title}
                                />
                                <div className={styles.details}>
                                    <h1 className={styles.title}>
                                        {media.title ? media.title : media.name}
                                    </h1>
                                    <div className={styles.macroData}>
                                        <p>
                                            {media.release_date
                                                ? media.release_date
                                                : media.first_air_date}{" "}
                                        </p>
                                        <p>|</p>
                                        {media.genres &&
                                            media.genres.map((genre) => (
                                                <p
                                                    key={genre.id}
                                                    className={styles.genre}
                                                >
                                                    {genre.name}
                                                </p>
                                            ))}
                                        <p>|</p>
                                        <p>
                                            {media.runtime
                                                ? media.runtime + " min"
                                                : "E" +
                                                  media.number_of_episodes}
                                        </p>
                                    </div>
                                    <p className={styles.tagline}>
                                        {media.tagline}
                                    </p>
                                    <p className={styles.overview}>
                                        {media.overview}
                                    </p>
                                </div>
                                <p className={styles.id}>ID: {media.id}</p>
                            </div>
                            <div className={styles.actorContainer}>
                                {creditsLoading && <Loading />}
                                {creditsError && (
                                    <p className={styles.error}>
                                        Error loading credits
                                    </p>
                                )}
                                {credits &&
                                    credits.cast.map((actor) => (
                                        <div
                                            key={actor.id}
                                            className={styles.actor}
                                        >
                                            <div className={styles.profile}>
                                                <img
                                                    className={styles.actorImg}
                                                    src={
                                                        actor.profile_path
                                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                            : placeholder
                                                    }
                                                    alt={actor.name}
                                                />
                                            </div>
                                            <div
                                                className={styles.nameContainer}
                                            >
                                                <p className={styles.name}>
                                                    {actor.name}
                                                </p>
                                                <p className={styles.character}>
                                                    {actor.character}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailedCard;
