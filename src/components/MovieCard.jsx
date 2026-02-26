import React from "react";
import { Star } from "lucide-react";

const MovieCard = ({ movie, onClick }) => {
  const imgBaseUrl = import.meta.env.VITE_APP_TMDB_IMG_BASE_URL || "https://image.tmdb.org/t/p/w500";
  const imageUrl = movie.poster_path
    ? `${imgBaseUrl}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div
      onClick={() => onClick(movie)}
      className="group relative rounded-xl overflow-hidden bg-[#111] hover:shadow-xl hover:shadow-white/5 transition-all duration-300 cursor-pointer h-full"
    >
      <div className="w-full h-full aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-300 font-light">
            {movie.release_date?.split("-")[0] || "N/A"}
          </span>
          <div className="flex items-center gap-1 text-xs text-white">
            <Star size={12} className="fill-white text-white" />
            <span className="font-medium">
              {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
