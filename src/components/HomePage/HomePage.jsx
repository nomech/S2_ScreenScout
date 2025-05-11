import React from "react";
import styles from "./HomePage.module.css";
import Banner from "../Banner/Banner";
import MediaGrid from "../MediaGrid/MediaGrid";
import SearchBar from "../Searchbar/SearchBar";

const Home = () => {
  const trendingMoviesUrl =
    "https://api.themoviedb.org/3/trending/movie/week?language=?language=en-US&page=1";
  const trendingTvUrl =
    "https://api.themoviedb.org/3/trending/tv/week?language=?language=en-US&page=1";
  return (
    <div className={styles.wrapper}>
      <Banner />

      <SearchBar />

      <MediaGrid title="Trending Movies" limit={10} url={trendingMoviesUrl} />

      <hr className={styles.divider} />

      <MediaGrid title="Trending TV shows" limit={10} url={trendingTvUrl} />
    </div>
  );
};

export default Home;
