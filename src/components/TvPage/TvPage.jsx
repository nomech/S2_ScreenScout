import React from "react";
import MediaGrid from "../MediaGrid/MediaGrid";

const TvPage = () => {
    const topRated = `https://api.themoviedb.org/3/tv/top_rated`;
    const airingToday = `https://api.themoviedb.org/3/tv/airing_today`;
    const onTheAir = `https://api.themoviedb.org/3/tv/on_the_air`;
    const popular = `https://api.themoviedb.org/3/tv/popular`;

    return (
        <>
            <MediaGrid title="Top Rated" url={topRated} limit={10} tv={true} />
            <MediaGrid
                title="Airing Today"
                url={airingToday}
                limit={10}
                tv={true}
            />
            <MediaGrid title="On The Air" url={onTheAir} limit={10} tv={true} />
            <MediaGrid title="Popular" url={popular} limit={10} movie={true} />
        </>
    );
};

export default TvPage;
