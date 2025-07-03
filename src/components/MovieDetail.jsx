import React, { useState, useEffect } from "react";
import { movieAPI } from "../services/api";

const MovieDetail = ({ movie, onClose }) => {
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetail();
  }, [movie.id]);

  const loadMovieDetail = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getMovieDetail(movie.id);
      setMovieDetail(data);
    } catch (error) {
      console.error("Error loading movie detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_APP_TMDB_IMG_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-screen overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Poster */}
            <div className="md:w-1/3 p-6">
              <img
                src={imageUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback jika gambar gagal dimuat
                  e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {movie.title}
              </h2>

              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span className="text-lg font-semibold">
                  {movie.vote_average?.toFixed(1)}/10
                </span>
                <span className="text-gray-600 ml-4">
                  ({movie.vote_count} votes)
                </span>
              </div>

              <div className="mb-4">
                <span className="text-gray-600">Release Date: </span>
                <span className="font-semibold">
                  {movie.release_date || "N/A"}
                </span>
              </div>

              {movieDetail?.genres && (
                <div className="mb-4">
                  <span className="text-gray-600">Genres: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movieDetail.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movieDetail?.runtime && (
                <div className="mb-4">
                  <span className="text-gray-600">Runtime: </span>
                  <span className="font-semibold">
                    {movieDetail.runtime} minutes
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  {movie.overview || "No overview available."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
