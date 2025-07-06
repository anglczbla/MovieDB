import React from "react";

const MovieCard = ({ movie, onClick }) => {
  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_APP_TMDB_IMG_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
    >
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-auto object-contain"
        onError={(e) => {
          // Fallback jika gambar gagal dimuat
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
        }}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {movie.release_date?.split("-")[0] || "N/A"}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="text-sm text-gray-700">
              {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
