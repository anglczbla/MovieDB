import { useState, useEffect } from 'react';
import { useMovies } from "../hooks/useMovie";

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
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'people', label: 'People', icon: '👥' },
    { id: 'all', label: 'All', icon: '🌟' },
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
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => {
              if (item.title && onMovieClick) {
                onMovieClick(item);
              }
            }}
          >
            <div className="w-full h-auto object-contain">
              <img
                src={
                  item.poster_path || item.profile_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
                    : '/placeholder-movie.jpg'
                }
                alt={item.title || item.name}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">
                {item.title || item.name}
              </h3>
              {item.title && ( // Hanya tampilkan untuk film
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-200">
                    {item.release_date?.split('-')[0] || 'N/A'}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm text-gray-100">
                      {item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
              {item.media_type && (
                <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded mt-2">
                  {item.media_type}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (trendingLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (trendingError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{trendingError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yellow-400">Trending Today</h2>
        <div className="flex space-x-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default TrendingSection;