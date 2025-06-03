import { useContext, createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

// This context provides movie and TV genre data fetched from an external API, allowing components to access genre information easily.
const genreContext = createContext();

export const GenreProvider = ({ children }) => {
    // State variables to hold movie and TV genres
    const [movieGenres, setMovieGenres] = useState(null);
    const [tvGenres, setTvGenres] = useState(null);

    // Fetch movie and TV genres from The Movie Database API
    const { data: movieData } = useFetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en"
    );

    const { data: tvData } = useFetch(
        "https://api.themoviedb.org/3/genre/tv/list?language=en"
    );

    // Effect to set genres when data is fetched
    useEffect(() => {
        if (tvData) {
            setTvGenres(tvData.genres);
        }
        if (movieData) {
            setMovieGenres(movieData.genres);
        }
    }, [movieData, tvData]);

    //Provides the fetched genres to its children components
    return (
        <genreContext.Provider value={{ movieGenres, tvGenres }}>
            {children}
        </genreContext.Provider>
    );
};

export const getGenreContext = () => useContext(genreContext);
