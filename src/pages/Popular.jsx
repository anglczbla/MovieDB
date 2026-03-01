import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import MovieList from "../components/MovieList";
import { useMovies } from "../hooks/useMovie";

const Popular = () => {
  const { handleMovieClick } = useOutletContext();
  const { movies, loading, error, page, totalPages, changePage, loadMoviesByType } = useMovies();

  useEffect(() => {
    loadMoviesByType("popular");
  }, [loadMoviesByType]);

  return (
    <MovieList
      title="Popular Movies"
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

export default Popular;
