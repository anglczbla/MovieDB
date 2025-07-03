import React, { useState, useEffect } from 'react';
import { movieAPI } from '../api';

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await movieAPI.getPopularPeople(page);
        if (page === 1) {
          setPeople(response.results || []);
        } else {
          setPeople(prev => [...prev, ...(response.results || [])]);
        }
      } catch (err) {
        setError('Failed to load people', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
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
      <h2 className="text-2xl font-bold text-yellow-400">Popular People</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {people.map((person) => (
          <div
            key={person.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
          >
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    : '/placeholder-person.jpg'
                }
                alt={person.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-person.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">{person.name}</h3>
              <p className="text-gray-400 text-sm">
                Popularity: {person.popularity?.toFixed(1)}
              </p>
              {person.known_for && person.known_for.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Known for:</p>
                  <p className="text-sm text-gray-300 truncate">
                    {person.known_for.map(item => item.title || item.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {people.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PeopleList;