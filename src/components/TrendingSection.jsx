import React, { useState, useEffect } from 'react';
import { movieAPI } from '../api';

const TrendingSection = ({ onMovieClick }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  const [trendingAll, setTrendingAll] = useState([]);
  const [activeSection, setActiveSection] = useState('movies');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const [moviesResponse, peopleResponse, allResponse] = await Promise.all([
          movieAPI.getTrendingMoviesDay(),
          movieAPI.getTrendingPeopleDay(),
          movieAPI.getTrendingAllDay(),
        ]);

        setTrendingMovies(moviesResponse.results || []);
        setTrendingPeople(peopleResponse.results || []);
        setTrendingAll(allResponse.results || []);
      } catch (err) {
        setError('Failed to load trending content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

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
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={
                  item.poster_path || item.profile_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
                    : '/placeholder-movie.jpg'
                }
                alt={item.title || item.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">
                {item.title || item.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-yellow-400 text-sm">
                  ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-gray-400 text-sm">
                  {item.release_date || item.first_air_date ? 
                    new Date(item.release_date || item.first_air_date).getFullYear() : 
                    'N/A'
                  }
                </span>
              </div>
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
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