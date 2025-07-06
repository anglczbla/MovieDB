import { useState, useEffect } from "react";
import { useMovies } from "./hooks/useMovie";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";
import Navigation from "./components/Navigation";
import GenreFilter from "./components/GenreFilter";
import PeopleList from "./components/PeopleList";
import TrendingSection from "./components/TrendingSection";
import { movieAPI } from "./services/api";

// Constants for tab names
const TABS = {
  POPULAR: "popular",
  SEARCH: "search",
  TRENDING: "trending",
  GENRES: "genres",
  PEOPLE: "people",
  TOP_RATED: "top-rated",
  UPCOMING: "upcoming",
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
  const [activeTab, setActiveTab] = useState(TABS.TRENDING);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // State terpisah untuk setiap jenis film
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [topRatedError, setTopRatedError] = useState(null);
  const [upcomingError, setUpcomingError] = useState(null);

  // Load data untuk trending page saat komponen pertama kali dimuat
  useEffect(() => {
    loadTopRatedMovies();
    loadUpcomingMovies();
  }, []);

  const loadTopRatedMovies = async () => {
    try {
      setTopRatedLoading(true);
      setTopRatedError(null);
      const data = await movieAPI.getTopRatedMovies();
      setTopRatedMovies(data.results);
    } catch (err) {
      setTopRatedError(`Gagal memuat film top rated: ${err.message}`);
    } finally {
      setTopRatedLoading(false);
    }
  };

  const loadUpcomingMovies = async () => {
    try {
      setUpcomingLoading(true);
      setUpcomingError(null);
      const data = await movieAPI.getUpcomingMovies();
      setUpcomingMovies(data.results);
    } catch (err) {
      setUpcomingError(`Gagal memuat film upcoming: ${err.message}`);
    } finally {
      setUpcomingLoading(false);
    }
  };

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

  const handleHomeSearch = async (query) => {
    if (query.trim()) {
      setIsSearching(true);
      await searchMovies(query);
      setSearchResults(movies);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Component untuk movie list dengan props yang bisa dikustomisasi
  const MovieListComponent = ({ title, movies: movieList, loading: isLoading, error: movieError }) => (
    <MovieList
      movies={movieList || movies}
      loading={isLoading !== undefined ? isLoading : loading}
      error={movieError !== undefined ? movieError : error}
      onMovieClick={handleMovieClick}
      title={title}
    />
  );

  const renderContent = () => {
    const contentMap = {
      [TABS.TRENDING]: () => (
        <div className="space-y-6">
          <SearchBar onSearch={handleHomeSearch} />
          <TrendingSection onMovieClick={handleMovieClick} />
          
          {/* Top Rated Movies dengan state terpisah */}
          <MovieListComponent 
            title="Top Rated Movies" 
            movies={topRatedMovies}
            loading={topRatedLoading}
            error={topRatedError}
          />
          
          {/* Upcoming Movies dengan state terpisah */}
          <MovieListComponent 
            title="Upcoming Movies" 
            movies={upcomingMovies}
            loading={upcomingLoading}
            error={upcomingError}
          />
          
          {/* Search Results */}
          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results
              </h2>
              <MovieList
                movies={searchResults}
                loading={false}
                error={null}
                onMovieClick={handleMovieClick}
                title=""
              />
            </div>
          )}
        </div>
      ),
      
      [TABS.SEARCH]: () => (
        <div className="space-y-6">
          <SearchBar onSearch={searchMovies} />
          <MovieListComponent title="Search Results" />
        </div>
      ),

      [TABS.POPULAR]: () => <MovieListComponent title="Popular Movies" />,

      [TABS.GENRES]: () => (
        <div className="space-y-6">
          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreSelect={handleGenreSelect}
          />
          <MovieListComponent
            title={
              selectedGenre ? `${selectedGenre.name} Movies` : "Select a Genre"
            }
          />
        </div>
      ),

      [TABS.TOP_RATED]: () => (
        <MovieListComponent 
          title="Top Rated Movies" 
          movies={topRatedMovies}
          loading={topRatedLoading}
          error={topRatedError}
        />
      ),

      [TABS.UPCOMING]: () => (
        <MovieListComponent 
          title="Upcoming Movies" 
          movies={upcomingMovies}
          loading={upcomingLoading}
          error={upcomingError}
        />
      ),

      [TABS.PEOPLE]: () => <PeopleList />,
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
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;