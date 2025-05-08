import React from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";

const MediaGrid = ({
  section = "trending",
  subsection = "all",
  period = "day",
  language = "en-US",
  page = 1,
  limit,
  title,
}) => {
  const path =
    section === "trending"
      ? `trending/${subsection}/${period}`
      : `${section}/${subsection}`;

  const url = `https://api.themoviedb.org/3/${path}?language=${language}&page=${page}`;

  const { data, isLoading } = useFetch(url);

  return (
    <>
      {isLoading && <Loading />}

      <div className={styles.mediaGridContainer}>
        <div className={styles.title}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.mediaGrid}>
          {data &&
            data.results.slice(0, limit).map((media) => (
              <div key={media.id} className={styles.card}>
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
        </div>
      </div>
    </>
  );
};

export default MediaGrid;
