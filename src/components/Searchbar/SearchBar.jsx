import { useState } from "react";
import styles from "./SearchBar.module.css";
import Button from "../Button/Button";
import FilterPanel from "../FIlterPanel/FilterPanel";
import { useNavigate } from "react-router-dom";
import filterIcon from "../../assets/icons/filter.svg";
import search from "../../assets/icons/search.svg";
import tv from "../../assets/icons/tv.svg";
import film from "../../assets/icons/film.svg";

//This component renders a search bar with media type selection and filter options.
const SearchBar = () => {
    // State to manage the selected media type and filter parameters
    const [mediaType, setMediaType] = useState("multi");
    const [filterParameters, setFilterParameters] = useState({
        query: "",
        include_adult: false,
        language: "en-US",
        page: "1",
    });

    // State to manage the visibility of the filter panel
    const [openFIlterPanel, setOpenFilterPanel] = useState(false);

    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Handler functions for input changes, form submission, and button clicks
    const handleOnChange = (e) => {
        setFilterParameters((previous) => {
            return { ...previous, query: e.target.value };
        });
    };

    // Function to handle form submission, preventing default behavior and navigating to the search results page
    const handleOnSubmit = (e) => {
        e.preventDefault();
        // Prevent search if the query is empty
        if (!filterParameters.query.trim()) {
            return;
        }

        // Construct the search URL with media type and filter parameters
        const params = new URLSearchParams(filterParameters);
        navigate(`/search?media_type=${mediaType}&${params.toString()}`);
    };

    // Function to handle media type button clicks, updating the media type state
    const handleOnClickMediaType = (e) => {
        let type = e.target.innerText.toLowerCase();
        if (type == "all") {
            type = "multi";
        }
        setMediaType(type.toLowerCase());
    };

    // Function to toggle the visibility of the filter panel
    const handleOnClickFilter = () => {
        setOpenFilterPanel((previous) => !previous);
    };

    return (
        // Render the search bar with input, buttons, and filter panel
        <div className={styles.searchContainer}>
            {/* Search bar form with input field and buttons for search and filter */}
            <form className={styles.searchBar} onSubmit={handleOnSubmit}>
                <input
                    type="text"
                    className={styles.searchInput}
                    value={filterParameters.query}
                    onChange={handleOnChange}
                    placeholder="Search for movies and tv shows..."
                />
                <Button type="submit" className="search">
                    <img className="icons" src={search} alt="Search Icon" />
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

            {/* Conditionally render the filter panel if openFIlterPanel is true */}
            {openFIlterPanel && (
                <FilterPanel
                    mediaFilter={mediaType}
                    setFilterParameters={setFilterParameters}
                />
            )}

            {/* Media type selection buttons */}
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
                    <img className="icons" src={film} alt="Movie Icon" />
                    Movie
                </Button>
                <Button
                    className={mediaType == "tv" ? "active" : "inactive"}
                    onClick={handleOnClickMediaType}
                >
                    <img className="icons" src={tv} alt="Tv Icon" />
                    TV
                </Button>
            </div>
        </div>
    );
};

export default SearchBar;
