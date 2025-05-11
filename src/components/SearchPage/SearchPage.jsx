import Banner from "../Banner/Banner";
import SearchBar from "../Searchbar/SearchBar";
import styles from "./SearchPage.module.css";
import MediaGrid from "../MediaGrid/MediaGrid";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const [matces, setMatches] = useState("0");
  const [searchString, setSearchString] = useState("");

  const { search } = useLocation();
  const searchQuery = search.replace("?searchQuery=", "");

  useEffect(() => {
    const queryParams = new URLSearchParams(searchQuery.split("?")[1]);
    const query = queryParams.get("query");
    console.log(searchQuery.split("?"))
    setSearchString(decodeURIComponent(query));
  }, [setSearchString, searchQuery]);

  return (
    <div className={styles.wrapper}>
      <Banner />
      <SearchBar />
      {
        <div className={styles.textContainer}>
          <h2 className={styles.results}>Results for:"{searchString}"</h2>
          <p className={styles.matching}>Found: {matces} matching results</p>
        </div>
      }
      <MediaGrid searchQuery={searchQuery} setMatches={setMatches} />
    </div>
  );
};

export default SearchPage;
