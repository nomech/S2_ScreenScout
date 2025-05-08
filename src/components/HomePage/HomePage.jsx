import React from "react";
import styles from "./HomePage.module.css";
import Banner from "../Banner/Banner";
import MediaGrid from "../MediaGrid/MediaGrid";

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <Banner />
      {
        <MediaGrid
          title="Trending Movies"
          limit={10}
          section="trending"
          subsection="movie"
          period="week"
          language="?language=en-US"
        />
      }
      <hr className={styles.divider} />
      <MediaGrid
        title="Trending TV shows"
        limit={10}
        section="trending"
        subsection="tv-show"
        period="week"
        language="?language=en-US"
      />
    </div>
  );
};

export default Home;
