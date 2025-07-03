import { useState } from 'react';
import { useMovies } from './hooks/useMovie';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import Navigation from './components/Navigation';
import GenreFilter from './components/GenreFilter';
import PeopleList from './components/PeopleList';
import TrendingSection from './components/TrendingSection';

function App() {
  const { movies, loading, error, searchMovies } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

   const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedMovie(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'popular':
        return (
          <MovieList
            movies={movies}
            loading={loading}
            error={error}
            onMovieClick={handleMovieClick}
            title="Popular Movies"
          />
        );
      
      case 'search':
        return (
          <div className="space-y-6">
            <SearchBar onSearch={searchMovies} />
            <MovieList
              movies={movies}
              loading={loading}
              error={error}
              onMovieClick={handleMovieClick}
              title="Search Results"
            />
          </div>
        );
      
      case 'trending':
        return (
          <TrendingSection
            onMovieClick={handleMovieClick}
          />
        );
      
      case 'genres':
        return (
          <div className="space-y-6">
            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreSelect={handleGenreSelect}
            />
            {selectedGenre && (
              <MovieList
                movies={movies}
                loading={loading}
                error={error}
                onMovieClick={handleMovieClick}
                title={`${selectedGenre.name} Movies`}
              />
            )}
          </div>
        );
      
      case 'people':
        return (
          <PeopleList />
        );
      
      case 'top-rated':
        return (
          <MovieList
            movies={movies}
            loading={loading}
            error={error}
            onMovieClick={handleMovieClick}
            title="Top Rated Movies"
          />
        );
      
      case 'upcoming':
        return (
          <MovieList
            movies={movies}
            loading={loading}
            error={error}
            onMovieClick={handleMovieClick}
            title="Upcoming Movies"
          />
        );
      
      default:
        return null;
    }
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

       {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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