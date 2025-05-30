import React from "react";
import Banner from "../Banner/Banner";
import MediaGrid from "../MediaGrid/MediaGrid";
import SearchBar from "../Searchbar/SearchBar";

//Component that serves as the home page of the application, displaying a banner, search bar, and trending media grids.
const Home = () => {
    // Define URLs for fetching trending movies and TV shows from The Movie Database (TMDB) API
    const trendingMoviesUrl =
        "https://api.themoviedb.org/3/trending/movie/week?language=?language=en-US&page=1";
    const trendingTvUrl =
        "https://api.themoviedb.org/3/trending/tv/week?language=?language=en-US&page=1";
    return (
        // Render the home page with a wrapper containing the banner, search bar, and media grids
        <div className="wrapper">
            <Banner />
            <SearchBar />
            <MediaGrid
                title="Trending Movies"
                limit={10}
                url={trendingMoviesUrl}
                movie={true}
            />

            <hr className="divider" />

            <MediaGrid
                title="Trending TV shows"
                limit={10}
                url={trendingTvUrl}
                tv={true}
            />
        </div>
    );
};

export default Home;
