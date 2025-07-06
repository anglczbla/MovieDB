import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'popular', label: 'Popular', icon: '🔥' },
    { id: 'upcoming', label: 'Upcoming', icon: '🚀' },
    { id: 'genres', label: 'Genres', icon: '🎭' },
    { id: 'top-rated', label: 'Top Rated', icon: '⭐' },
    { id: 'people', label: 'People', icon: '👥' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex w-full justify-between space-x-6 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;