import React, { useState, useEffect } from "react";
import styles from "./Banner.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";

const Banner = () => {
  const { data, isLoading } = useFetch(
    "https://api.themoviedb.org/3/trending/all/week?language=en-US"
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data?.results?.length) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.results.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className={styles.banner}>
      {isLoading && <Loading />}
      {data &&
        data.results.map((media, index) => (
          <div
            key={media.id}
            className={`${styles.mediaContainer} ${
              index === currentIndex ? styles.activeSlide : ""
            }`}
          >
            <div className={styles.backdrop}>
              <img
                className={styles.backdrop}
                src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                alt={media.title}
              />
            </div>
            <div key={media.id} className={styles.mediaDetails}>
              <img
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
                alt={media.title}
              />
              <div className={styles.descriptino}>
                <h1 className={styles.title}>
                  {media.title ? media.title : media.name}
                </h1>
                <p className={styles.overview}>{media.overview}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Banner;
