import Banner from "../Banner/Banner";
import SearchBar from "../Searchbar/SearchBar";
import styles from "./SearchPage.module.css";
import MediaGrid from "../MediaGrid/MediaGrid";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Paginator from "../Paginator/Paginator";

// This component renders the search page with a banner, search bar, and media grid for displaying search results.
const SearchPage = () => {
    // State variables to manage search results, search string, and pagination
    const [matches, setMatches] = useState(null);
    const [searchString, setSearchString] = useState("");
    const [pages, setPages] = useState(1);

    // Using useSearchParams to access the query parameters from the URL
    const [searchParams] = useSearchParams();

    // Constructing the URL for fetching search results based on the media type and query parameters
    const url = `https://api.themoviedb.org/3/search/${searchParams.get(
        "media_type"
    )}?${searchParams.toString()}`;

    // Effect to update the search string when the component mounts or when searchParams change
    useEffect(() => {
        const query = searchParams.get("query");
        setSearchString(decodeURIComponent(query));
    }, [setSearchString, searchParams]);

    return (
        <>
            {/* Banner and SearchBar components for the search page */}
            <Banner />
            <SearchBar />

            {/* Displaying the search string and number of matches found */}
            <div className={styles.textContainer}>
                {searchString && (
                    <h2 className={styles.results}>
                        Results for:"{searchString}"
                    </h2>
                )}
                {matches && (
                    <p className={styles.matching}>
                        Found: {matches} matching results
                    </p>
                )}
            </div>

            {/* MediaGrid component to display search results, passing the URL and state setters for matches and pages */}
            <MediaGrid
                url={url}
                setMatches={setMatches}
                getTotalPages={setPages}
            />
            <Paginator items={matches} pages={pages} />
        </>
    );
};

export default SearchPage;
