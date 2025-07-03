import { useState } from 'react';
import { useMovies } from './hooks/useMovie';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';

function App() {
  const { movies, loading, error, searchMovies } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            🎬 Movie Database
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={searchMovies} />
        <MovieList
          movies={movies}
          loading={loading}
          error={error}
          onMovieClick={handleMovieClick}
        />
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default App;