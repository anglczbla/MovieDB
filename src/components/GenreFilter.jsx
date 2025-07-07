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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400">Select Genre</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre)}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              selectedGenre?.id === genre.id
                ? "bg-yellow-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
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
