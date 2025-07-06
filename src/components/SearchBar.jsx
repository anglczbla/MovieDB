import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

   const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* Hero Content */}
      <div className="relative px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome.
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a movie"
              className="flex-1 px-6 py-4 text-gray-700 focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold hover:from-teal-500 hover:to-blue-600 transition-all"
            >
              Search
            </button>
            {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-8 py-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold hover:from-teal-500 hover:to-blue-600 transition-all"
          >
            Clear
          </button>
        )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;