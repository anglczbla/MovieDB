import React from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieSection = ({ title, movies, onMovieClick, loading }) => {
  const scrollRef = React.useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64 animate-pulse">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-500 text-center py-8">
          No movies found
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-64">
              <MovieCard
                movie={movie}
                onClick={onMovieClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ movies, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const featuredMovie = movies[currentIndex];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!featuredMovie) return null;

  const backdropUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path}`
    : '/no-image.svg';

  return (
    <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
      <img
        src={backdropUrl}
        alt={featuredMovie.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              {featuredMovie.title}
            </h1>
            <p className="text-gray-200 text-lg mb-6 line-clamp-3">
              {featuredMovie.overview}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-white font-semibold">
                  {featuredMovie.vote_average?.toFixed(1)}
                </span>
              </div>
              {featuredMovie.release_date && (
                <div className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  {new Date(featuredMovie.release_date).getFullYear()}
                </div>
              )}
            </div>
            <button
              onClick={() => onMovieClick(featuredMovie)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Watch Now
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const MovieList = ({ movies, loading, error, onMovieClick, title }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">❌ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show hero section only for trending/popular movies
  const showHero = title === "Trending Movies" || title === "Popular Movies";

  return (
    <div className="space-y-6">
      {showHero && movies.length > 0 && (
        <HeroSection movies={movies.slice(0, 5)} onMovieClick={onMovieClick} />
      )}
      
      <MovieSection
        title={title}
        movies={movies}
        onMovieClick={onMovieClick}
        loading={loading}
      />
    </div>
  );
};

export default MovieList;