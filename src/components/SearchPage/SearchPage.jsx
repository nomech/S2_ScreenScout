import Banner from "../Banner/Banner";
import SearchBar from "../Searchbar/SearchBar";
import styles from "./SearchPage.module.css";
import MediaGrid from "../MediaGrid/MediaGrid";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Paginator from "../Paginator/Paginator";

const SearchPage = () => {
    const [matches, setMatches] = useState(null);
    const [searchString, setSearchString] = useState("");
    const [searchParams] = useSearchParams();
    const [pages, setPages] = useState(1);

    const url = `https://api.themoviedb.org/3/search/${searchParams.get(
        "media_type"
    )}?${searchParams.toString()}`;

    useEffect(() => {
        const query = searchParams.get("query");
        setSearchString(decodeURIComponent(query));
    }, [setSearchString, searchParams]);

    return (
        <div className={styles.wrapper}>
            <Banner />
            <SearchBar />
            {
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
            }
            <MediaGrid
                url={url}
                setMatches={setMatches}
                getTotalPages={setPages}
            />
            <Paginator items={matches} pages={pages} />
        </div>
    );
};

export default SearchPage;
