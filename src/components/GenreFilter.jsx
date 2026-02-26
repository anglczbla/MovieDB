import React from "react";

const GenreFilter = ({
  selectedGenre,
  onGenreSelect,
  genres,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-light text-white tracking-wide">Select Genre</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
              selectedGenre?.id === genre.id
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                : "bg-[#111] text-gray-400 border-white/5 hover:bg-[#1a1a1a] hover:text-white hover:border-white/20"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
