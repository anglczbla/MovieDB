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
  const [movieDetail, setMovieDetail] = useState(null);

  // Load video, gambar, dan cast ketika modal dibuka
  useEffect(() => {
    if (movie && movie.id) {
      loadMovieVideos(movie.id);
      loadMovieImages(movie.id);
      loadMovieCredits(movie.id);
      
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

  const getCastImageUrl = (profilePath, size = "w185") => {
    if (!profilePath) return "/api/placeholder/185/278";
    return `https://image.tmdb.org/t/p/${size}${profilePath}`;
  };

   const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  };

   const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };


  //  FUNGSI ATUR TAB
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6 p-4 md:p-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded-full"></span>
                Sinopsis
              </h3>
              <p className="text-gray-200 leading-relaxed text-base">
                {movie.overview || "Tidak ada sinopsis tersedia."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-green-400 font-bold text-sm sm:text-base">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Tanggal Rilis</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{formatDate(movie.release_date)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-yellow-400 font-bold text-sm sm:text-base">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Rating</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{movie.vote_average.toFixed(1)}/10</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-purple-400 font-bold text-sm sm:text-base">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Popularitas</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{Math.round(movie.popularity)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-emerald-400 font-bold text-sm sm:text-base">💎</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Revenue</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{formatCurrency(movieDetail.revenue)}</p>
                  </div>
                </div>
              </div>

               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-purple-400 font-bold text-sm sm:text-base">⏱️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Durasi</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{formatRuntime(movieDetail.runtime)}</p>
                  </div>
                </div>
              </div>

               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-red-400 font-bold text-sm sm:text-base">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Budget</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{formatCurrency(movieDetail.budget)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-blue-400 font-bold text-sm sm:text-base">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Bahasa</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{movie.original_language.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Genres */}
            {movieDetail.genres && movieDetail.genres.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movieDetail.genres.map((genre) => (
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

               {movieDetail.production_companies && movieDetail.production_companies.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
                  Production Companies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {movieDetail.production_companies.map((company) => (
                    <div key={company.id} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
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
          </div>
        );

      case "videos":
        return (
          <div className="space-y-6 p-4 md:p-6">
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
                    <div className="p-4 border-b border-white/20">
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
          <div className="space-y-6 p-4 md:p-6">
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
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="p-2 sm:p-4 bg-black/20 text-center">
                    <p className="text-gray-300 font-medium text-sm sm:text-base">
                      {selectedImageIndex + 1} dari {movieImages.length} gambar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
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
          <div className="space-y-6 p-4 md:p-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
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
                    <div className="p-2 sm:p-3">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">
                        {cast.name}
                      </h4>
                      <p className="text-gray-300 text-xs truncate">
                        {cast.character}
                      </p>
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

  // INI ADALAH RETURN UTAMA
  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden h-screen">
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

      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="flex-shrink-0 px-4 md:px-8 pt-8 pb-6">
          <div className="flex items-end space-x-4 md:space-x-8">
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-32 sm:w-48 h-48 sm:h-72 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
              />
            </div>

            <div className="text-white pb-4 flex-1">
              <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="text-white/80 text-lg sm:text-xl mb-2 sm:mb-4 drop-shadow-md">
                  {movie.original_title}
                </p>
              )}
              <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow-lg">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-white/95">{formatDate(movie.release_date)}</span>
                <span className="text-white/95">{movie.original_language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 mx-4 md:mx-8 mb-4 sm:mb-6">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-1">
            {[
              { key: "info", label: "Informasi", icon: "📋" },
              { key: "cast", label: "Pemeran", icon: "👥" },
              { key: "videos", label: "Video", icon: "🎬" },
              { key: "images", label: "Gambar", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-center font-medium text-sm sm:text-base transition-all duration-200 rounded-xl ${
                  activeTab === tab.key
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 sm:pb-8 w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;