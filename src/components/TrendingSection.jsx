import { useState, useEffect } from 'react';
import { useMovies } from "../hooks/useMovie";
import { Star } from 'lucide-react';

const TrendingSection = ({ onMovieClick }) => {
  const {
    trendingMovies,
    trendingPeople,
    trendingAll,
    trendingLoading,
    trendingError,
    loadTrending,
  } = useMovies();

  const [activeSection, setActiveSection] = useState('movies');
  // Memuat data trending saat komponen mount
  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  const sections = [
    { id: 'movies', label: 'Movies' },
    { id: 'people', label: 'People' },
    { id: 'all', label: 'All' },
  ];

  const renderContent = () => {
    let data = [];
    switch (activeSection) {
      case 'movies':
        data = trendingMovies;
        break;
      case 'people':
        data = trendingPeople;
        break;
      case 'all':
        data = trendingAll;
        break;
      default:
        data = [];
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden bg-[#111] hover:shadow-xl hover:shadow-white/5 transition-all duration-300 cursor-pointer"
            onClick={() => {
              if (item.title && onMovieClick) {
                onMovieClick(item);
              }
            }}
          >
            <div className="w-full h-auto aspect-[2/3] overflow-hidden">
              <img
                src={
                  item.poster_path || item.profile_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
                    : '/placeholder-movie.jpg'
                }
                alt={item.title || item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="font-medium text-white line-clamp-1">
                {item.title || item.name}
              </h3>
              {item.title && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-300 font-light">
                    {item.release_date?.split('-')[0] || 'N/A'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-white">
                    <Star size={12} className="fill-white text-white" />
                    <span className="font-medium">
                      {item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (trendingLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (trendingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 font-light">{trendingError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <h2 className="text-2xl font-light text-white tracking-wide">Trending Today</h2>
        <div className="flex bg-[#1a1a1a] p-1 rounded-full border border-white/5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-white text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default TrendingSection;
