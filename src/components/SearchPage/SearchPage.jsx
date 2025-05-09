import Banner from "../Banner/Banner";
import SearchBar from "../Searchbar/SearchBar";
import styles from "./SearchPage.module.css";
import MediaGrid from "../MediaGrid/MediaGrid";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const SearchPage = () => {
  const [matces, setMatches] = useState("0");

  const { search } = useLocation();
  const searchQuery = search.replace("?searchQuery=", "");

  return (
    <div className={styles.wrapper}>
      <Banner />
      <SearchBar />
      {
        <div>
          <h2>Results:""</h2>
          <h3>Found: {matces} matching results</h3>
        </div>
      }
      <MediaGrid searchQuery={searchQuery} setMatches={setMatches} />
    </div>
  );
};

export default SearchPage;
