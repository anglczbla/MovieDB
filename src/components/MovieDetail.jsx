import { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovie";
import { 
  X, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Globe, 
  Play, 
  Image as ImageIcon, 
  Users, 
  Info,
  AlertTriangle,
  Tv
} from "lucide-react";

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
    if (!profilePath) return null;
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
          <div className="space-y-8 animate-fade-in">
            {/* Sinopsis */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Sinopsis</h3>
              <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                {displayMovie.overview || "Tidak ada sinopsis tersedia."}
              </p>
            </div>

            {/* Genre */}
            {displayMovie.genres && displayMovie.genres.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {displayMovie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-[#1a1a1a] text-gray-300 px-4 py-1.5 rounded-full text-sm font-light border border-white/5"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Informasi */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
              {[
                { label: "Tanggal Rilis", value: formatDate(displayMovie.release_date), icon: <Calendar size={18} className="text-gray-400" /> },
                { label: "Rating", value: `${displayMovie.vote_average?.toFixed(1) || "N/A"}/10`, icon: <Star size={18} className="text-gray-400" /> },
                { label: "Popularitas", value: displayMovie.popularity ? Math.round(displayMovie.popularity) : "N/A", icon: <TrendingUp size={18} className="text-gray-400" /> },
                { label: "Durasi", value: detailLoading ? "Loading..." : formatRuntime(displayMovie.runtime), icon: <Clock size={18} className="text-gray-400" /> },
                { label: "Revenue", value: detailLoading ? "Loading..." : formatCurrency(displayMovie.revenue), icon: <DollarSign size={18} className="text-gray-400" /> },
                { label: "Budget", value: detailLoading ? "Loading..." : formatCurrency(displayMovie.budget), icon: <DollarSign size={18} className="text-gray-400" /> },
                { label: "Bahasa", value: displayMovie.original_language?.toUpperCase() || "N/A", icon: <Globe size={18} className="text-gray-400" /> },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-500 text-xs uppercase tracking-wider">{item.label}</h4>
                    <p className="text-gray-200 font-light text-sm mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {detailError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={20} />
                <p className="text-red-400 text-sm font-light">{detailError}</p>
              </div>
            )}

            {/* Production Companies */}
            {displayMovie.production_companies && displayMovie.production_companies.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-lg font-medium text-white mb-4">Production Companies</h3>
                <div className="flex flex-wrap gap-6">
                  {displayMovie.production_companies.map((company) => (
                    <div key={company.id} className="flex items-center gap-3">
                      {company.logo_path ? (
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1">
                          <img
                            src={getImageUrl(company.logo_path, "w92")}
                            alt={company.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-[#1a1a1a] rounded border border-white/5 flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-600" />
                        </div>
                      )}
                      <span className="text-gray-400 text-sm font-light">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "videos":
        return (
          <div className="space-y-6 animate-fade-in">
            {videosLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {videosError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <p className="text-red-400 font-light">{videosError}</p>
              </div>
            )}

            {!videosLoading && !videosError && movieVideos.length === 0 && (
              <div className="py-12 text-center border border-white/5 rounded-xl bg-[#111]">
                <Tv className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 font-light">Tidak ada video tersedia untuk film ini.</p>
              </div>
            )}

            {!videosLoading && movieVideos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movieVideos.map((video) => (
                  <div key={video.id} className="bg-[#111] rounded-xl overflow-hidden border border-white/5">
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
                    <div className="p-4">
                      <h4 className="font-medium text-white text-sm line-clamp-1">{video.name}</h4>
                      <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">{video.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "images":
        return (
          <div className="space-y-6 animate-fade-in">
            {imagesLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {imagesError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <p className="text-red-400 font-light">{imagesError}</p>
              </div>
            )}

            {!imagesLoading && !imagesError && movieImages.length === 0 && (
              <div className="py-12 text-center border border-white/5 rounded-xl bg-[#111]">
                <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 font-light">Tidak ada gambar tersedia untuk film ini.</p>
              </div>
            )}

            {!imagesLoading && movieImages.length > 0 && (
              <div className="space-y-4">
                {/* Main Image Viewer */}
                <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5 relative">
                  <img
                    src={getImageUrl(movieImages[selectedImageIndex].file_path, "w780")}
                    alt={`${movie.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full max-h-[60vh] object-contain"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <p className="text-white/80 font-light text-xs tracking-wider">
                      {selectedImageIndex + 1} / {movieImages.length}
                    </p>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {movieImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-200 ${
                        index === selectedImageIndex
                          ? "ring-2 ring-white opacity-100"
                          : "opacity-50 hover:opacity-100 border border-white/10"
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
          <div className="space-y-6 animate-fade-in">
            {creditsLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {creditsError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <p className="text-red-400 font-light">{creditsError}</p>
              </div>
            )}

            {!creditsLoading && !creditsError && (!movieCredits || movieCredits.length === 0) && (
              <div className="py-12 text-center border border-white/5 rounded-xl bg-[#111]">
                <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 font-light">Tidak ada data pemeran untuk film ini.</p>
              </div>
            )}

            {!creditsLoading && movieCredits && movieCredits.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movieCredits.slice(0, 20).map((cast) => {
                  const castImage = getCastImageUrl(cast.profile_path, "w185");
                  return (
                    <div key={cast.id} className="group relative rounded-xl overflow-hidden bg-[#111] hover:shadow-xl hover:shadow-white/5 transition-all duration-300">
                      <div className="aspect-[2/3] bg-gray-900 relative overflow-hidden">
                        {castImage ? (
                          <img
                            src={castImage}
                            alt={cast.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                            <Users className="text-gray-700" size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <h4 className="font-medium text-white text-sm line-clamp-1">{cast.name}</h4>
                        <p className="text-gray-400 text-xs font-light line-clamp-1 mt-0.5">{cast.character}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!movie) return null;

  const bgImage = movie.backdrop_path || movie.poster_path;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 md:p-12 bg-black/90 backdrop-blur-sm">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Close Area */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose}></div>

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] bg-[#0a0a0a] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-white/10"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-black/50 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all duration-200 z-50 border border-white/10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Header/Hero Backdrop */}
          <div className="relative h-64 sm:h-80 w-full bg-[#111]">
            {bgImage ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/original${bgImage}`}
                  alt="background"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full bg-[#111]"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          </div>

          {/* Content Wrapper */}
          <div className="relative px-6 sm:px-10 -mt-32 sm:-mt-40 pb-10">
            
            {/* Info Section (Poster + Title) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 mb-10">
              <div className="w-40 sm:w-52 flex-shrink-0 z-10">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto object-cover rounded-xl shadow-2xl border border-white/10"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-[#1a1a1a] rounded-xl border border-white/10 flex items-center justify-center shadow-2xl">
                    <ImageIcon className="text-gray-700 w-12 h-12" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left z-10 mt-4 sm:mt-0">
                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight mb-2">
                  {movie.title}
                </h1>
                {movie.original_title !== movie.title && (
                  <p className="text-gray-400 font-light text-lg mb-4">
                    {movie.original_title}
                  </p>
                )}
                
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-1.5 text-white bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-white/5">
                    <Star size={16} className="fill-white" />
                    <span className="font-medium">{movie.vote_average?.toFixed(1) || "N/A"}</span>
                  </div>
                  <span className="text-gray-300 font-light flex items-center gap-1.5">
                    <Calendar size={16} className="text-gray-500" />
                    {movie.release_date?.split('-')[0] || "N/A"}
                  </span>
                  <span className="text-gray-400 font-light uppercase tracking-wider text-xs px-2 py-1 border border-white/10 rounded">
                    {movie.original_language || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-white/10 mb-8 pb-1 gap-6">
              {[
                { key: "info", label: "Overview", icon: <Info size={16} /> },
                { key: "cast", label: "Cast", icon: <Users size={16} /> },
                { key: "videos", label: "Videos", icon: <Play size={16} /> },
                { key: "images", label: "Photos", icon: <ImageIcon size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 flex items-center gap-2 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.key
                      ? "text-white border-white"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            <div className="min-h-[300px]">
              {renderTabContent()}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
