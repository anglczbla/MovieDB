import { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovie";

const MovieDetail = ({ movie, onClose }) => {
  const {
    movieVideos,
    movieImages,
    movieCredits, 

    videosLoading,
    imagesLoading,
    creditsLoading, 

    videosError,
    imagesError,
    creditsError, 

    loadMovieVideos,
    loadMovieImages,
    loadMovieCredits, 
    resetMovieMedia,
  } = useMovies();

  const [activeTab, setActiveTab] = useState("info");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load video, gambar, dan cast ketika modal dibuka
  useEffect(() => {
    if (movie && movie.id) {
      loadMovieVideos(movie.id);
      loadMovieImages(movie.id);
      loadMovieCredits(movie.id); // BARU: load cast data
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

  // BARU: Function untuk mendapatkan profile picture cast
  const getCastImageUrl = (profilePath, size = "w185") => {
    if (!profilePath) return "/api/placeholder/185/278"; // placeholder jika tidak ada foto
    return `https://image.tmdb.org/t/p/${size}${profilePath}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded-full"></span>
                Sinopsis
              </h3>
              <p className="text-gray-200 leading-relaxed text-base">
                {movie.overview || "Tidak ada sinopsis tersedia."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-400 font-bold">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Tanggal Rilis</h4>
                    <p className="text-gray-300">{formatDate(movie.release_date)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-400 font-bold">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Rating</h4>
                    <p className="text-gray-300">{movie.vote_average.toFixed(1)}/10</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-400 font-bold">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Popularitas</h4>
                    <p className="text-gray-300">{Math.round(movie.popularity)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400 font-bold">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Bahasa</h4>
                    <p className="text-gray-300">{movie.original_language.toUpperCase()}</p>
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
              <h3 className="text-xl font-bold text-white">Trailer & Video</h3>
            </div>

            {videosLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-300 font-medium">Memuat video...</p>
              </div>
            )}

            {videosError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium">{videosError}</p>
              </div>
            )}

            {!videosLoading && !videosError && movieVideos.length === 0 && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📺</div>
                <p className="text-gray-300">Tidak ada video tersedia untuk film ini.</p>
              </div>
            )}

            {!videosLoading && movieVideos.length > 0 && (
              <div className="space-y-6">
                {movieVideos.map((video) => (
                  <div key={video.id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                    <div className="p-5 border-b border-white/20">
                      <h4 className="font-semibold text-white text-lg">{video.name}</h4>
                      <p className="text-gray-300 text-sm mt-1">{video.type}</p>
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
              <h3 className="text-xl font-bold text-white">Galeri Gambar</h3>
            </div>

            {imagesLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-300 font-medium">Memuat gambar...</p>
              </div>
            )}

            {imagesError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium">{imagesError}</p>
              </div>
            )}

            {!imagesLoading && !imagesError && movieImages.length === 0 && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                <p className="text-gray-300">Tidak ada gambar tersedia untuk film ini.</p>
              </div>
            )}

            {!imagesLoading && movieImages.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                  <img
                    src={getImageUrl(movieImages[selectedImageIndex].file_path, "w780")}
                    alt={`${movie.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4 bg-black/20 text-center">
                    <p className="text-gray-300 font-medium">
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
                          ? "border-blue-500 ring-2 ring-blue-400/50"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.file_path, "w185")}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // BARU: Tab Cast
      case "cast":
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
              <h3 className="text-xl font-bold text-white">Pemeran Film</h3>
            </div>

            {creditsLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-300 font-medium">Memuat data pemeran...</p>
              </div>
            )}

            {creditsError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium">{creditsError}</p>
              </div>
            )}

            {!creditsLoading && !creditsError && (!movieCredits || movieCredits.length === 0) && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">👥</div>
                <p className="text-gray-300">Tidak ada data pemeran untuk film ini.</p>
              </div>
            )}

            {!creditsLoading && movieCredits && movieCredits.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {movieCredits.slice(0, 20).map((cast) => (
                  <div
                    key={cast.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all hover:scale-105"
                  >
                    <div className="aspect-square bg-gray-800 relative overflow-hidden">
                      <img
                        src={getCastImageUrl(cast.profile_path, "w185")}
                        alt={cast.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/185/278";
                        }}
                      />
                      {!cast.profile_path && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                          <span className="text-gray-400 text-4xl">👤</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">
                        {cast.name}
                      </h4>
                      <p className="text-gray-300 text-xs truncate">
                        {cast.character}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-gray-300 text-xs ml-1">
                          {cast.popularity ? Math.round(cast.popularity) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Background Image Full Screen */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"></div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110 z-[60]"
      >
        <span className="text-2xl">×</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-shrink-0 px-8 pt-8 pb-6">
          <div className="flex items-end space-x-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              />
            </div>

            {/* Movie Info */}
            <div className="text-white pb-4 flex-1">
              <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="text-white/80 text-xl mb-4 drop-shadow-md">
                  {movie.original_title}
                </p>
              )}
              <div className="flex items-center space-x-4 text-lg">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold shadow-lg">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-white/95">{formatDate(movie.release_date)}</span>
                <span className="text-white/95">{movie.original_language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - DIPERBARUI: Menambah tab Cast */}
        <div className="flex-shrink-0 mx-8 mb-6">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-1">
            {[
              { key: "info", label: "Informasi", icon: "📋" },
              { key: "cast", label: "Pemeran", icon: "👥" }, // BARU: Tab Cast
              { key: "videos", label: "Video", icon: "🎬" },
              { key: "images", label: "Gambar", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-6 text-center font-medium transition-all duration-200 rounded-xl ${
                  activeTab === tab.key
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="max-w-6xl">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;