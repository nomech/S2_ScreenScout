import React, { useEffect, useState } from "react";
import styles from "./MediaGrid.module.css";
import { useFetch } from "../../hooks/useFetch";
import Loading from "../Loading/Loading";

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

  console.log(cardStyle);
  return (
    <>
      {isLoading && <Loading />}

      <div className={styles.mediaGridContainer}>
        <div className={styles.title}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div
          className={`${styles.mediaGrid} ${styles["container" + cardStyle]}`}
        >
          {data &&
            items?.media_type != "person" &&
            items.slice(0, limit).map((media) => (
              <div
                key={media.id}
                className={`${styles.card} ${styles["card" + cardStyle]}`}
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
        </div>
      </div>
    </>
  );
};

export default MediaGrid;
