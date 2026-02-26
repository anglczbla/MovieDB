import { Calendar, ChevronLeft, ChevronRight, Star } from "lucide-react";
import React from "react";
import MovieCard from "./MovieCard";

const MovieSection = ({ title, movies, onMovieClick, loading }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 bg-[#1a1a1a] rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-48 lg:w-56 animate-pulse">
              <div className="bg-[#1a1a1a] h-72 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-light text-white tracking-wide mb-4">{title}</h2>
        <div className="text-gray-500 text-center py-8 font-light">No movies found</div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-white tracking-wide">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-[#1a1a1a] rounded-full border border-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-[#1a1a1a] rounded-full border border-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-48 lg:w-56">
              <MovieCard movie={movie} onClick={onMovieClick} />
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
    : "https://via.placeholder.com/1280x720/374151/ffffff?text=No+Image";
  return (
    <div className="relative h-[60vh] min-h-[400px] mb-12 rounded-2xl overflow-hidden group">
      <img
        src={backdropUrl}
        alt={featuredMovie.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3 font-light leading-relaxed">
              {featuredMovie.overview}
            </p>
            <div className="flex items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-1.5 text-white">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-medium">
                  {featuredMovie.vote_average?.toFixed(1)}
                </span>
              </div>
              {featuredMovie.release_date && (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  {new Date(featuredMovie.release_date).getFullYear()}
                </div>
              )}
            </div>
            <button
              onClick={() => onMovieClick(featuredMovie)}
              className="bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const MovieList = ({
  movies,
  loading,
  error,
  onMovieClick,
  title,
  page,
  totalPages,
  onPageChange,
}) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-lg mb-6 font-light">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show hero section only for trending/popular movies
  const showHero = title === "Trending Movies" || title === "Popular Movies";

  return (
    <div className="space-y-8">
      {showHero && movies.length > 0 && (
        <HeroSection movies={movies.slice(0, 5)} onMovieClick={onMovieClick} />
      )}

      <MovieSection
        title={title}
        movies={movies}
        onMovieClick={onMovieClick}
        loading={loading}
      />

      {totalPages > 1 && onPageChange && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-12 pb-12">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              page <= 1
                ? "text-gray-600 cursor-not-allowed"
                : "text-white hover:bg-white/10"
            }`}
          >
            Prev
          </button>

          {(() => {
            const groupSize = 10;
            const startPage =
              Math.floor((page - 1) / groupSize) * groupSize + 1;
            const endPage = Math.min(startPage + groupSize - 1, totalPages);
            const pages = [];

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    page === i
                      ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              page >= totalPages
                ? "text-gray-600 cursor-not-allowed"
                : "text-white hover:bg-white/10"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;
