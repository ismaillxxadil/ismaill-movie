import { useEffect, useState } from "react";
const Key = "466f8998";
export function useMovies(quary) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState("");

  useEffect(() => {
    const controler = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&s=${quary}`,
          { signal: controler.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found!");
        console.log(data.Search);
        console.log(data);
        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        seterror(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    /*  handelCloseMonie(); */
    fetchMovie();
    return function () {
      controler.abort();
    };
  }, [quary]);
  return { movies, isLoading, error };
}
