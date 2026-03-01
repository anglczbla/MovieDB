import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MovieList from "../components/MovieList";
import { useMovies } from "../hooks/useMovie";

const Upcoming = () => {
  const { handleMovieClick } = useOutletContext();
  const { movies, loading, error, page, totalPages, changePage, loadMoviesByType } = useMovies();

  useEffect(() => {
    loadMoviesByType("upcoming");
  }, [loadMoviesByType]);

  return (
    <MovieList
      title="Upcoming Movies"
      movies={movies}
      loading={loading}
      error={error}
      onMovieClick={handleMovieClick}
      page={page}
      totalPages={totalPages}
      onPageChange={changePage}
    />
  );
};

export default Upcoming;
