import React from "react";
import MediaGrid from "../MediaGrid/MediaGrid";

// This component renders a page displaying various categories of TV shows using the MediaGrid component.
const TvPage = () => {
    // URLs for fetching different categories of TV shows from The Movie Database API
    const topRated = `https://api.themoviedb.org/3/tv/top_rated`;
    const airingToday = `https://api.themoviedb.org/3/tv/airing_today`;
    const onTheAir = `https://api.themoviedb.org/3/tv/on_the_air`;
    const popular = `https://api.themoviedb.org/3/tv/popular`;

    return (
        <>
            {/* Render the TV page with various MediaGrid components for different categories of TV shows */}
            <MediaGrid title="Top Rated" url={topRated} limit={10} tv={true} />
            <hr className="divider" />
            <MediaGrid
                title="Airing Today"
                url={airingToday}
                limit={10}
                tv={true}
            />
            <hr className="divider" />
            <MediaGrid title="On The Air" url={onTheAir} limit={10} tv={true} />
            <hr className="divider" />
            <MediaGrid title="Popular" url={popular} limit={10} tv={true} />
        </>
    );
};

export default TvPage;
