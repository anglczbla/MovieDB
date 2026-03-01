import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const tabs = [
    { id: '', label: 'Trending' },
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
            <NavLink
              key={tab.id}
              to={`/${tab.id}`}
              className={({ isActive }) =>
                `whitespace-nowrap pb-1 text-sm font-medium transition-all duration-300 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`
              }
              end={tab.id === ''}
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-white rounded-t-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
