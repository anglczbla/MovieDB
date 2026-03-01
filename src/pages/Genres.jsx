import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import GenreFilter from "../components/GenreFilter";
import MovieList from "../components/MovieList";
import { useMovies } from "../hooks/useMovie";

const Genres = () => {
  const { handleMovieClick } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get("genreId");

  const { movies, loading, error, genres, filterByGenre, page, totalPages, changePage } = useMovies();

  useEffect(() => {
    if (genreId) {
      filterByGenre(parseInt(genreId));
    }
  }, [genreId, filterByGenre]);

  const handleGenreSelect = useCallback(
    (genre) => {
      if (genre?.id) {
        navigate(`/genres?genreId=${genre.id}`);
      } else {
        navigate("/genres");
      }
    },
    [navigate]
  );

  const selectedGenre = genres.find((g) => g.id.toString() === genreId);

  return (
    <div className="space-y-6">
      <GenreFilter
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
        genres={genres}
        loading={false}
        error={null}
      />
      <MovieList
        title={genreId ? `${selectedGenre?.name || ""} Movies` : "Select a Genre"}
        movies={genreId ? movies : []}
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

export default Genres;
