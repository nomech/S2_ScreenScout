import { useState } from "react";
import styles from "./SearchBar.module.css";
import Button from "../Button/Button";
import FilterPanel from "../FIlterPanel/FilterPanel";
import { useNavigate } from "react-router-dom";
import filterIcon from "../../assets/icons/filter.svg";

const SearchBar = () => {
    const [mediaType, setMediaType] = useState("multi");
    const [filterParameters, setFilterParameters] = useState({
        query: "",
        include_adult: false,
        language: "en-US",
        page: "1",
    });

    const [openFIlterPanel, setOpenFilterPanel] = useState(false);

    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setFilterParameters((previous) => {
            return { ...previous, query: e.target.value };
        });
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(filterParameters);

        const params = new URLSearchParams(filterParameters);

        navigate(`/search?media_type=${mediaType}&${params.toString()}`);
    };

    const handleOnClickMediaType = (e) => {
        let type = e.target.innerText.toLowerCase();
        if (type == "all") {
            type = "multi";
        }
        setMediaType(type.toLowerCase());
    };

    const handleOnClickFilter = () => {
        console.log("click");

        setOpenFilterPanel((previous) => !previous);
    };

    return (
        <div className={styles.searchContainer}>
            <form className={styles.searchBar} onSubmit={handleOnSubmit}>
                <input
                    type="text"
                    className={styles.searchInput}
                    value={filterParameters.query}
                    onChange={handleOnChange}
                    placeholder="Search for movies and tv shows..."
                />
                <Button type="submit" className="search">
                    Search
                </Button>
                <Button
                    type="button"
                    className="filter"
                    onClick={handleOnClickFilter}
                >
                    <img className="icons" src={filterIcon} alt="filterIcon" />
                </Button>
            </form>
            {openFIlterPanel && (
                <FilterPanel
                    mediaFilter={mediaType}
                    setFilterParameters={setFilterParameters}
                />
            )}
            <div className={styles.buttonContainer}>
                <Button
                    className={mediaType == "multi" ? "active" : "inactive"}
                    onClick={handleOnClickMediaType}
                >
                    All
                </Button>
                <Button
                    className={mediaType == "movie" ? "active" : "inactive"}
                    onClick={handleOnClickMediaType}
                >
                    Movie
                </Button>
                <Button
                    className={mediaType == "tv" ? "active" : "inactive"}
                    onClick={handleOnClickMediaType}
                >
                    TV
                </Button>
            </div>
        </div>
    );
};

export default SearchBar;
