import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medaType, setMediaType] = useState("multi");
  const [adult, setAdult] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formattedSearchTerm = searchTerm.replaceAll(" ", "%20");
    const searchQuery = `${medaType}?query=${formattedSearchTerm}&include_adult=${adult}&language=en-US&page=1`;
    navigate(`/search?searchQuery=${searchQuery}`);
  };

  /*   const handleAdultChange = () => {
    setAdult((previous) => !previous);
  }; */

  const handleOnClickMediaType = (e) => {
    let type = e.target.innerText.toLowerCase();
    if (type == "all") {
      type = "multi";
    }
    setMediaType(type.toLowerCase());
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchBar} onSubmit={handleOnSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleOnChange}
          placeholder="Search for movies and tv shows..."
        />
        <Button type="submit" className="search">
          Search
        </Button>
      </form>
      <div className={styles.buttonContainer}>
        <Button className="searchMediatype" onClick={handleOnClickMediaType}>
          All
        </Button>
        <Button className="searchMediatype" onClick={handleOnClickMediaType}>
          Movie
        </Button>
        <Button className="searchMediatype" onClick={handleOnClickMediaType}>
          TV
        </Button>
        {/*        <Input
          label="18+"
          type="checkbox"
          value={adult}
          onChange={handleAdultChange}
          className={styles.adult}
          id="adult"
          name="adult"
        /> */}
      </div>
    </div>
  );
};

export default SearchBar;
