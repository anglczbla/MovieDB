import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { movieAPI } from "../services/api";

const SearchBar = ({ onSearch, isHero = false }) => {
  const [query, setQuery] = useState("");
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    if (isHero) {
      const fetchBg = async () => {
        try {
          const data = await movieAPI.getTrendingMoviesDay();
          if (data.results && data.results.length > 0) {
            const randomMovie =
              data.results[
                Math.floor(Math.random() * Math.min(5, data.results.length))
              ];
            if (randomMovie.backdrop_path) {
              setBgImage(
                `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`,
              );
            }
          }
        } catch (error) {
          console.error("Failed to fetch hero background:", error);
        }
      };
      fetchBg();
    }
  }, [isHero]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (isHero) {
    return (
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12 -mt-8 py-24 sm:py-32 flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {bgImage && (
            <img
              src={bgImage}
              alt="Background"
              className="w-full h-full object-cover opacity-30 object-top"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-tight drop-shadow-lg">
            Welcome to <span className="font-semibold">MovieDB</span>.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
            Millions of movies, TV shows and people to discover. Explore now.
          </p>

          <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="flex items-center bg-[#1a1a1a]/90 backdrop-blur-md rounded-full border border-white/20 overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 focus-within:border-white/50 focus-within:ring-4 focus-within:ring-white/10">
              <div className="pl-6 pr-2 text-gray-400">
                <Search
                  size={22}
                  className="opacity-70 group-focus-within:opacity-100 transition-opacity"
                />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a movie, tv show, person..."
                className="flex-1 px-4 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg font-light"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              )}
              <button
                type="submit"
                className="px-10 py-5 bg-white text-black font-medium hover:bg-gray-200 transition-colors hidden sm:block text-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-10 mt-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative group"
      >
        <div className="flex items-center bg-[#1a1a1a] rounded-full border border-white/10 overflow-hidden shadow-lg transition-all duration-300 focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/5">
          <div className="pl-6 pr-2 text-gray-400">
            <Search
              size={20}
              className="opacity-70 group-focus-within:opacity-100 transition-opacity"
            />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search..."
            className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base font-light"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
