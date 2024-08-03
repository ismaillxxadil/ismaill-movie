import { useEffect, useRef, useState } from "react";
import "./index.css"; // Ensure proper CSS import
import StareRating from "./StareRating";
import { useLocalStorage } from "./useLocalStorage";

const Key = "466f8998";

export default function App() {
  const [quary, setQuary] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorage([], "watched");
  /* const [watched, setWatched] = useState(function () {
    const storeValue = localStorage.getItem("watched");
    return JSON.parse(storeValue);  })*/

  // const tempQuary = "sudan";
  function handelSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handelCloseMonie() {
    setSelectedId(null);
  }
  function handelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handelremoveMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
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
    handelCloseMonie();
    fetchMovie();
    return function () {
      controler.abort();
    };
  }, [quary]);
  /*  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  ); */
  return (
    <>
      <Navabar>
        <Search quary={quary} setQuary={setQuary} />
        <Numresult movies={movies} />
      </Navabar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handelSelectedId} movies={movies} />
          )}

          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handelCloseMonie}
              onaddWatched={handelAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovelist
                watched={watched}
                ondeleitWatch={handelremoveMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>🤕</span> {message}
    </p>
  );
}

const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

function Navabar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ quary, setQuary }) {
  const inputEl = useRef(null);
  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) return;
        console.log(e.code);
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuary("");
        }
      }
      document.addEventListener("keydown", callBack);
      return () => document.addEventListener("keydown", callBack);
    },
    [setQuary]
  );
  /* useEffect(function () {
    const el = document.querySelector(".search");
    console.log(el);
    el.focus();
  }, []); */
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={quary}
      onChange={(e) => setQuary(e.target.value)}
      ref={inputEl}
    />
  );
}

function Numresult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onClose, onaddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ueserReatin, setUeserReatin] = useState("");
  const refCount = useRef(0);
  useEffect(
    function () {
      if (ueserReatin) refCount.current = refCount.current + 1;
    },
    [ueserReatin]
  );
  const isWatched = watched
    .map((watched) => watched.imdbID)
    .includes(selectedId);
  const watchedUeserReating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.ueserReatin;
  console.log(isWatched);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Directir: directir,
    Genre: genre,
  } = movie;
  console.log(title, year);
  useEffect(
    function () {
      async function getMovieDetials() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetials();
    },
    [selectedId]
  );
  function handelAddWatched() {
    const newmovie = {
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      title,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      ueserReatin,
      countUeserReating: refCount.current,
    };
    onaddWatched(newmovie);
    onClose();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "Ismail | Movie";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onClose]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={poster} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span></span>
                {imdbRating} imdb Reating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {ueserReatin > 0 && (
                <button className="btn-add" onClick={handelAddWatched}>
                  + Add
                </button>
              )}
              {!isWatched ? (
                <StareRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUeserReatin}
                />
              ) : (
                <p>
                  you reated with movie {watchedUeserReating} <span> ⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>startting {actors}</p>
            <p>Directed be {directir}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.ueserReatin));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovelist({ watched, ondeleitWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMove
          key={movie.imdbID}
          movie={movie}
          ondeleitWatch={ondeleitWatch}
        />
      ))}
    </ul>
  );
}

function WatchedMove({ movie, ondeleitWatch }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.ueserReatin}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => ondeleitWatch(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
