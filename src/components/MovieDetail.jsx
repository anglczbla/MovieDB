import { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovie";

const MovieDetail = ({ movie, onClose }) => {
  const {
    movieVideos,
    movieImages,
    videosLoading,
    imagesLoading,
    videosError,
    imagesError,
    loadMovieVideos,
    loadMovieImages,
    resetMovieMedia,
  } = useMovies();

  const [activeTab, setActiveTab] = useState("info");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load video dan gambar ketika modal dibuka
  useEffect(() => {
    if (movie && movie.id) {
      loadMovieVideos(movie.id);
      loadMovieImages(movie.id);
    }

    // Cleanup saat modal ditutup
    return () => {
      resetMovieMedia();
    };
  }, [movie]);

  const handleClose = () => {
    resetMovieMedia();
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getYouTubeEmbedUrl = (videoKey) => {
    return `https://www.youtube.com/embed/${videoKey}`;
  };

  const getImageUrl = (imagePath, size = "w500") => {
    return `https://image.tmdb.org/t/p/${size}${imagePath}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded-full"></span>
                Sinopsis
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {movie.overview || "Tidak ada sinopsis tersedia."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Tanggal Rilis
                    </h4>
                    <p className="text-gray-600">
                      {formatDate(movie.release_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-600 font-bold">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Rating</h4>
                    <p className="text-gray-600">
                      {movie.vote_average.toFixed(1)}/10
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Popularitas</h4>
                    <p className="text-gray-600">
                      {Math.round(movie.popularity)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Bahasa</h4>
                    <p className="text-gray-600">
                      {movie.original_language.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "videos":
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <span className="w-1 h-6 bg-red-500 mr-3 rounded-full"></span>
              <h3 className="text-xl font-bold text-gray-800">
                Trailer & Video
              </h3>
            </div>

            {videosLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Memuat video...
                </p>
              </div>
            )}

            {videosError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="text-red-600 font-medium">{videosError}</p>
              </div>
            )}

            {!videosLoading && !videosError && movieVideos.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📺</div>
                <p className="text-gray-600">
                  Tidak ada video tersedia untuk film ini.
                </p>
              </div>
            )}

            {!videosLoading && movieVideos.length > 0 && (
              <div className="space-y-6">
                {movieVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {video.name}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">{video.type}</p>
                    </div>
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(video.key)}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "images":
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <span className="w-1 h-6 bg-green-500 mr-3 rounded-full"></span>
              <h3 className="text-xl font-bold text-gray-800">Galeri Gambar</h3>
            </div>

            {imagesLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Memuat gambar...
                </p>
              </div>
            )}

            {imagesError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="text-red-600 font-medium">{imagesError}</p>
              </div>
            )}

            {!imagesLoading && !imagesError && movieImages.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                <p className="text-gray-600">
                  Tidak ada gambar tersedia untuk film ini.
                </p>
              </div>
            )}

            {!imagesLoading && movieImages.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <img
                    src={getImageUrl(
                      movieImages[selectedImageIndex].file_path,
                      "w780"
                    )}
                    alt={`${movie.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 bg-gray-50 text-center">
                    <p className="text-gray-600 font-medium">
                      {selectedImageIndex + 1} dari {movieImages.length} gambar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {movieImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        index === selectedImageIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.file_path, "w185")}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.type === "poster" && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          P
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header dengan layout yang lebih baik */}
        <div className="relative">
          {/* Background image dengan overlay gradient */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w1280${
                movie.backdrop_path || movie.poster_path
              }`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end space-x-6">
              {/* Poster - tidak terpotong */}
              <div className="flex-shrink-0 transform translate-y-8">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-32 h-48 object-cover rounded-xl shadow-2xl border-4 border-white"
                />
              </div>

              {/* Movie info */}
              <div className="text-white pb-8 flex-1">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                {movie.original_title !== movie.title && (
                  <p className="text-white/80 text-lg mb-3">
                    {movie.original_title}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-white/90">
                    {formatDate(movie.release_date)}
                  </span>
                  <span className="text-white/90">
                    {movie.original_language.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50 border-b border-gray-200 mt-8">
          {[
            { key: "info", label: "Informasi", icon: "📋" },
            { key: "videos", label: "Video", icon: "🎬" },
            { key: "images", label: "Gambar", icon: "🖼️" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all hover:bg-white ${
                activeTab === tab.key
                  ? "bg-white border-b-2 border-blue-500 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
