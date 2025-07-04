import { useState } from "react";
import { useMovies } from "./hooks/useMovie";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";
import Navigation from "./components/Navigation";
import GenreFilter from "./components/GenreFilter";
import PeopleList from "./components/PeopleList";
import TrendingSection from "./components/TrendingSection";

// Constants for tab names
const TABS = {
  POPULAR: "popular",
  SEARCH: "search",
  TRENDING: "trending",
  GENRES: "genres",
  PEOPLE: "people",
  TOP_RATED: "top-rated",
  UPCOMING: "upcoming"
};

function App() {
  const { 
    movies, 
    loading, 
    error, 
    searchMovies, 
    loadMoviesByType, 
    filterByGenre,
  } = useMovies();
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.POPULAR);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedMovie(null);
    
    // Reset genre and load data according to tab
    if (tab !== TABS.GENRES) {
      setSelectedGenre(null);
      const dataLoadingTabs = [TABS.SEARCH, TABS.TRENDING, TABS.PEOPLE];
      if (!dataLoadingTabs.includes(tab)) {
        loadMoviesByType(tab);
      }
    }
  };

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre);
    setActiveTab(TABS.GENRES);
    
    if (genre?.id) {
      await filterByGenre(genre.id);
    }
  };

  // Component for movie list with common props
  const MovieListComponent = ({ title }) => (
    <MovieList
      movies={movies}
      loading={loading}
      error={error}
      onMovieClick={handleMovieClick}
      title={title}
    />
  );

  const renderContent = () => {
    const contentMap = {
      [TABS.POPULAR]: () => (
        <MovieListComponent title="Popular Movies" />
      ),
      
      [TABS.SEARCH]: () => (
        <div className="space-y-6">
          <SearchBar onSearch={searchMovies} />
          <MovieListComponent title="Search Results" />
        </div>
      ),
      
      [TABS.TRENDING]: () => (
        <TrendingSection onMovieClick={handleMovieClick} />
      ),
      
      [TABS.GENRES]: () => (
        <div className="space-y-6">
          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreSelect={handleGenreSelect}
          />
          <MovieListComponent 
            title={selectedGenre ? `${selectedGenre.name} Movies` : "Select a Genre"} 
          />
        </div>
      ),
      
      [TABS.PEOPLE]: () => (
        <PeopleList />
      ),
      
      [TABS.TOP_RATED]: () => (
        <MovieListComponent title="Top Rated Movies" />
      ),
      
      [TABS.UPCOMING]: () => (
        <MovieListComponent title="Upcoming Movies" />
      )
    };

    return contentMap[activeTab]?.() || null;
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
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
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