import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import { useMovies } from "../hooks/useMovie";

const BackToHomeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-4 px-4 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
  >
    <span>←</span> Back to Home
  </button>
);

const Search = () => {
  const { handleMovieClick } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q");

  const { movies, loading, error, page, totalPages, changePage, searchMovies } = useMovies();

  useEffect(() => {
    if (q) {
      searchMovies(q);
    }
  }, [q, searchMovies]);

  const handleSearch = useCallback(
    (query) => {
      if (!query || query.trim() === "") {
        searchParams.delete("q");
        setSearchParams(searchParams);
        navigate("/");
        return;
      }
      setSearchParams({ q: query.trim() });
    },
    [navigate, searchParams, setSearchParams]
  );

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />
      <BackToHomeButton onClick={() => navigate("/")} />
      <MovieList
        title={q ? `Search Results for "${q}"` : "Search"}
        movies={q ? movies : []}
        loading={loading}
        error={error}
        onMovieClick={handleMovieClick}
        page={page}
        totalPages={totalPages}
        onPageChange={changePage}
      />
    </div>
  );
};

export default Search;
