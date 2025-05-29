import React from "react";
import MediaGrid from "../MediaGrid/MediaGrid";

const MoviesPage = () => {
    const mostRated = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc`;
    const latest = `https://api.themoviedb.org/3/movie/popular`;
    const inCinema = `https://api.themoviedb.org/3/movie/now_playing`;
    const upcomming = `https://api.themoviedb.org/3/movie/upcoming`;

    return (
        <>
            <MediaGrid
                title="Most Rated Movies"
                url={mostRated}
                limit={10}
                movie={true}
            />
            <MediaGrid
                title="Popular Movies"
                url={latest}
                limit={10}
                movie={true}
            />
            <MediaGrid
                title="Upcomming Movies"
                url={upcomming}
                limit={10}
                movie={true}
            />
            <MediaGrid
                title="In Cinema now"
                url={inCinema}
                limit={10}
                movie={true}
            />
        </>
    );
};

export default MoviesPage;
