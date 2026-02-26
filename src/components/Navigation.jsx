import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'popular', label: 'Popular' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'genres', label: 'Genres' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'people', label: 'People' },
  ];

  return (
    <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-6">
        <div className="flex w-full space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap pb-1 text-sm font-medium transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white rounded-t-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
