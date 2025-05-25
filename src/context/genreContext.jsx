import React, { createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
    const [movieGenres, setMovieGenres] = useState(null);
    const [tvGenres, setTvGenres] = useState(null);
    const { data: movieData } = useFetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en"
    );

    const { data: tvData } = useFetch(
        "https://api.themoviedb.org/3/genre/tv/list?language=en"
    );

    useEffect(() => {
        console.log(movieData);
        if (movieData) {
            setTvGenres(tvData.genres);
        }
        if (tvData) {
            setMovieGenres(movieData.genres);
        }
    }, [movieData, tvData]);

    return (
        <GenreContext.Provider value={{ movieGenres, tvGenres }}>
            {children}
        </GenreContext.Provider>
    );
};

export default GenreContext;
 