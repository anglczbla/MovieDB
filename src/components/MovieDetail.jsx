import { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovie";

const MovieDetail = ({ movie, onClose }) => {
  const {
    movieVideos,
    movieImages,
    movieCredits,
    movieDetail,
    videosLoading,
    imagesLoading,
    creditsLoading,
    detailLoading,
    videosError,
    imagesError,
    creditsError,
    detailError,
    loadMovieVideos,
    loadMovieImages,
    loadMovieCredits,
    loadMovieDetails,
    resetMovieMedia,
  } = useMovies();

  const [activeTab, setActiveTab] = useState("info");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load movie details ketika component mount
  useEffect(() => {
    if (movie?.id) {
      loadMovieVideos(movie.id);
      loadMovieImages(movie.id);
      loadMovieCredits(movie.id);
      loadMovieDetails(movie.id);
    }

    return () => {
      resetMovieMedia();
    };
  }, [
    movie?.id,
    loadMovieVideos,
    loadMovieImages,
    loadMovieCredits,
    loadMovieDetails,
    resetMovieMedia,
  ]);

  const handleClose = () => {
    resetMovieMedia();
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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

  const getCastImageUrl = (profilePath, size = "w185") => {
    if (!profilePath) return "/api/placeholder/185/278";
    return `https://image.tmdb.org/t/p/${size}${profilePath}`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Gunakan movieDetail jika ada, fallback ke movie
  const displayMovie = movieDetail || movie;

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <span className="w-1 h-5 bg-blue-500 mr-3 rounded-full"></span>
                Sinopsis
              </h3>
              <p className="text-gray-200 leading-relaxed text-sm">
                {displayMovie.overview || "Tidak ada sinopsis tersedia."}
              </p>
            </div>

            {displayMovie.genres && displayMovie.genres.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <span className="w-1 h-5 bg-purple-500 mr-3 rounded-full"></span>
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displayMovie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-400 font-bold text-sm">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Tanggal Rilis</h4>
                    <p className="text-gray-300 text-xs">
                      {formatDate(displayMovie.release_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-400 font-bold text-sm">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Rating</h4>
                    <p className="text-gray-300 text-xs">
                      {displayMovie.vote_average?.toFixed(1) || "N/A"}/10
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-400 font-bold text-sm">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Popularitas</h4>
                    <p className="text-gray-300 text-xs">
                      {displayMovie.popularity ? Math.round(displayMovie.popularity) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-emerald-400 font-bold text-sm">💎</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Revenue</h4>
                    <p className="text-gray-300 text-xs">
                      {detailLoading ? "Loading..." : formatCurrency(displayMovie.revenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-400 font-bold text-sm">⏱️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Durasi</h4>
                    <p className="text-gray-300 text-xs">
                      {detailLoading ? "Loading..." : formatRuntime(displayMovie.runtime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-400 font-bold text-sm">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Budget</h4>
                    <p className="text-gray-300 text-xs">
                      {detailLoading ? "Loading..." : formatCurrency(displayMovie.budget)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-400 font-bold text-sm">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Bahasa</h4>
                    <p className="text-gray-300 text-xs">
                      {displayMovie.original_language?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {detailError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-300 text-sm">{detailError}</p>
              </div>
            )}

            {displayMovie.production_companies && displayMovie.production_companies.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <span className="w-1 h-5 bg-orange-500 mr-3 rounded-full"></span>
                  Production Companies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayMovie.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center space-x-3 bg-white/5 rounded-lg p-3"
                    >
                      {company.logo_path && (
                        <img
                          src={getImageUrl(company.logo_path, "w92")}
                          alt={company.name}
                          className="w-8 h-8 object-contain bg-white rounded"
                        />
                      )}
                      <span className="text-gray-300 text-sm">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "videos":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <span className="w-1 h-5 bg-red-500 mr-3 rounded-full"></span>
              <h3 className="text-lg font-bold text-white">Trailer & Video</h3>
            </div>

            {videosLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-3 text-gray-300 font-medium text-sm">Memuat video...</p>
              </div>
            )}

            {videosError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <div className="text-red-400 text-2xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium text-sm">{videosError}</p>
              </div>
            )}

            {!videosLoading && !videosError && movieVideos.length === 0 && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                <div className="text-gray-400 text-2xl mb-2">📺</div>
                <p className="text-gray-300 text-sm">Tidak ada video tersedia untuk film ini.</p>
              </div>
            )}

            {!videosLoading && movieVideos.length > 0 && (
              <div className="space-y-4">
                {movieVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/20">
                      <h4 className="font-semibold text-white text-base">{video.name}</h4>
                      <p className="text-gray-300 text-xs mt-1">{video.type}</p>
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
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <span className="w-1 h-5 bg-green-500 mr-3 rounded-full"></span>
              <h3 className="text-lg font-bold text-white">Galeri Gambar</h3>
            </div>

            {imagesLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-3 text-gray-300 font-medium text-sm">Memuat gambar...</p>
              </div>
            )}

            {imagesError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <div className="text-red-400 text-2xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium text-sm">{imagesError}</p>
              </div>
            )}

            {!imagesLoading && !imagesError && movieImages.length === 0 && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                <div className="text-gray-400 text-2xl mb-2">🖼️</div>
                <p className="text-gray-300 text-sm">Tidak ada gambar tersedia untuk film ini.</p>
              </div>
            )}

            {!imagesLoading && movieImages.length > 0 && (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                  <img
                    src={getImageUrl(movieImages[selectedImageIndex].file_path, "w780")}
                    alt={`${movie.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3 bg-black/20 text-center">
                    <p className="text-gray-300 font-medium text-sm">
                      {selectedImageIndex + 1} dari {movieImages.length} gambar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
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

      case "cast":
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <span className="w-1 h-5 bg-purple-500 mr-3 rounded-full"></span>
              <h3 className="text-lg font-bold text-white">Pemeran Film</h3>
            </div>

            {creditsLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-3 text-gray-300 font-medium text-sm">Memuat data pemeran...</p>
              </div>
            )}

            {creditsError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <div className="text-red-400 text-2xl mb-2">⚠️</div>
                <p className="text-red-300 font-medium text-sm">{creditsError}</p>
              </div>
            )}

            {!creditsLoading && !creditsError && (!movieCredits || movieCredits.length === 0) && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                <div className="text-gray-400 text-2xl mb-2">👥</div>
                <p className="text-gray-300 text-sm">Tidak ada data pemeran untuk film ini.</p>
              </div>
            )}

            {!creditsLoading && movieCredits && movieCredits.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                          <span className="text-gray-400 text-2xl">👤</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h4 className="font-semibold text-white text-xs mb-1 truncate">{cast.name}</h4>
                      <p className="text-gray-300 text-xs truncate">{cast.character}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-gray-300 text-xs ml-1">
                          {cast.popularity ? Math.round(cast.popularity) : "N/A"}
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

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black z-50" style={{ width: '100vw', height: '100vh' }}>
      {/* Background Image */}
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
        className="fixed top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-110 z-60"
      >
        <span className="text-xl">×</span>
      </button>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col" style={{ maxWidth: '1200px', margin: '0 auto', width: '95%' }}>
        {/* Header Section */}
        <div className="flex-shrink-0 pt-6 pb-4">
          <div className="flex items-end space-x-4">
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-28 h-40 object-cover rounded-xl shadow-2xl border-2 border-white/20"
              />
            </div>

            <div className="text-white pb-2 flex-1">
              <h1 className="text-2xl font-bold mb-2 drop-shadow-lg">
                {movie.title}
              </h1>
              {movie.original_title !== movie.title && (
                <p className="text-white/80 text-base mb-2 drop-shadow-md">
                  {movie.original_title}
                </p>
              )}
              <div className="flex items-center space-x-3 text-sm">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold shadow-lg">
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="text-white/95">{formatDate(movie.release_date)}</span>
                <span className="text-white/95">{movie.original_language?.toUpperCase() || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-1">
            {[
              { key: "info", label: "Info", icon: "📋" },
              { key: "cast", label: "Cast", icon: "👥" },
              { key: "videos", label: "Video", icon: "🎬" },
              { key: "images", label: "Gambar", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 text-center font-medium text-sm transition-all duration-200 rounded-lg ${
                  activeTab === tab.key
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Single Scroll */}
        <div className="flex-1 overflow-y-auto" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}>
          <div className="pb-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;