import { useState, useEffect, useCallback } from "react";
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

// 4. Back to Home Button Component
const BackToHomeButton = ({ onClick, isVisible }) => {
  if (!isVisible) return null;
  return (
    <button
      onClick={onClick}
      className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      ← Back to Home
    </button>
  );
};

function App() {
  const {
    movies,
    setMovies,
    loading,
    error,
    setError,
    genres,
    trendingPeople,
    trendingLoading,
    trendingError,
    searchMovies,
    loadMoviesByType,
    filterByGenre,
  } = useMovies();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.TRENDING);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentDataType, setCurrentDataType] = useState('trending');

  // State terpisah untuk setiap jenis film (set initial loading ke false)
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [topRatedError, setTopRatedError] = useState(null);
  const [upcomingError, setUpcomingError] = useState(null);

  // Load data hanya saat tab trending pertama kali dibuka
  useEffect(() => {
    if (activeTab === TABS.TRENDING && topRatedMovies.length === 0 && upcomingMovies.length === 0) {
      loadTopRatedMovies();
      loadUpcomingMovies();
    }
  }, [activeTab]);

  const loadTopRatedMovies = async () => {
    if (topRatedLoading || topRatedMovies.length > 0) return; // Prevent duplicate calls
    
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
    if (upcomingLoading || upcomingMovies.length > 0) return; // Prevent duplicate calls
    
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
    setSearchResults([]); // Reset hasil search saat pindah tab
    setIsSearching(false);
    setCurrentDataType(tab);

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
    setCurrentDataType('genres');

    if (genre?.id) {
      await filterByGenre(genre.id);
    }
  };

  // Optimized handleSearch function
  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      // Reset ke halaman utama
      setSearchResults([]);
      if (setMovies) setMovies([]);
      setCurrentDataType('trending');
      setIsSearching(false);
      if (setError) setError(null);
      return;
    }

    setIsSearching(true);
    if (setError) setError(null);
    
    try {
      const data = await movieAPI.searchMovies(query.trim());
      const results = data.results || [];
      
      // Update kedua state untuk konsistensi
      setSearchResults(results);
      if (setMovies) setMovies(results);
      setCurrentDataType('search');
    } catch (err) {
      const errorMsg = `Gagal mencari film: ${err.message}`;
      if (setError) setError(errorMsg);
      setSearchResults([]);
      if (setMovies) setMovies([]);
    } finally {
      setIsSearching(false);
    }
  }, [setMovies, setError]);

  // Optimized handleHomeSearch
  const handleHomeSearch = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      setCurrentDataType('trending');
      return;
    }

    setIsSearching(true);
    if (setError) setError(null);
    
    try {
      const data = await movieAPI.searchMovies(query.trim());
      const results = data.results || [];
      setSearchResults(results);
      setCurrentDataType('search');
    } catch (err) {
      const errorMsg = `Gagal mencari film: ${err.message}`;
      if (setError) setError(errorMsg);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [setError]);

  // Component untuk movie list dengan props yang bisa dikustomisasi
  const MovieListComponent = ({
    title,
    movies: movieList,
    loading: isLoading,
    error: movieError,
  }) => (
    <MovieList
      movies={movieList || movies}
      loading={isLoading !== undefined ? isLoading : loading}
      error={movieError !== undefined ? movieError : error}
      onMovieClick={handleMovieClick}
      title={title}
    />
  );

  const renderContent = () => {
    // Hasil search hanya muncul di halaman utama (Trending)
    if (activeTab === TABS.TRENDING) {
      if (isSearching) {
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        );
      }
      if (searchResults.length > 0) {
        return (
          <div className="space-y-6">
            <SearchBar onSearch={handleHomeSearch}/>
            <BackToHomeButton 
              isVisible={currentDataType === 'search'} 
              onClick={() => handleHomeSearch('')} 
            />
            <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
            <MovieList
              movies={searchResults}
              loading={false}
              error={null}
              onMovieClick={handleMovieClick}
              title=""
            />
          </div>
        );
      }
    }
    // Default: tampilkan tab sesuai activeTab
    const contentMap = {
      [TABS.TRENDING]: () => (
        <div className="space-y-6">
          <SearchBar onSearch={handleHomeSearch} />
          <TrendingSection onMovieClick={handleMovieClick} />
          <MovieListComponent
            title="Top Rated Movies"
            movies={topRatedMovies}
            loading={topRatedLoading}
            error={topRatedError}
          />
          <MovieListComponent
            title="Upcoming Movies"
            movies={upcomingMovies}
            loading={upcomingLoading}
            error={upcomingError}
          />
        </div>
      ),
      [TABS.SEARCH]: () => (
        <div className="space-y-6">
          <SearchBar onSearch={searchMovies} />
          <BackToHomeButton 
            isVisible={currentDataType === 'search'} 
            onClick={() => handleSearch('')} 
          />
          <MovieListComponent title="Search Results" />
        </div>
      ),
      [TABS.POPULAR]: () => <MovieListComponent title="Popular Movies" />,
      [TABS.GENRES]: () => (
        <div className="space-y-6">
          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreSelect={handleGenreSelect}
            genres={genres} 
            loading={loading} 
            error={error} 
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
      [TABS.PEOPLE]: () => (
        <PeopleList
          trendingPeople={trendingPeople} 
          trendingLoading={trendingLoading} 
          trendingError={trendingError} 
        />
      ),
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