import { useState, useEffect, useCallback } from "react";
import { movieAPI } from "../services/api";
import { config } from "dotenv"; 
config();

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [currentDataType, setCurrentDataType] = useState("popular");

  // State untuk video, gambar, credits, trending dan detail
  const [movieVideos, setMovieVideos] = useState([]);
  const [movieImages, setMovieImages] = useState([]);
  const [movieCredits, setMovieCredits] = useState([]);
  const [movieDetail, setMovieDetail] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  const [trendingAll, setTrendingAll] = useState([]);

  // Loading states
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Error states
  const [trendingError, setTrendingError] = useState(null);
  const [videosError, setVideosError] = useState(null);
  const [imagesError, setImagesError] = useState(null);
  const [creditsError, setCreditsError] = useState(null);
  const [detailError, setDetailError] = useState(null);

  // Fungsi untuk memuat data, dibungkus dengan useCallback
  // Fungsi untuk memuat data trending
  const loadTrending = useCallback(async () => {
    try {
      setTrendingLoading(true);
      setTrendingError(null);
      console.log("Fetching trending data..."); // Debugging
      const [moviesResponse, peopleResponse, allResponse] = await Promise.all([
        movieAPI.getTrendingMoviesDay(),
        movieAPI.getTrendingPeopleDay(),
        movieAPI.getTrendingAllDay(),
      ]);
      console.log("Trending data loaded:", {
        movies: moviesResponse.results,
        people: peopleResponse.results,
        all: allResponse.results,
      }); // Debugging
      setTrendingMovies(moviesResponse.results || []);
      setTrendingPeople(peopleResponse.results || []);
      setTrendingAll(allResponse.results || []);
    } catch (err) {
      console.error("Error fetching trending data:", err); // Debugging
      setTrendingError(`Gagal memuat trending content: ${err.message}`);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const loadPopularMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getPopularMovies();
      setMovies(data.results);
      setCurrentDataType("popular");
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film populer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTopRatedMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getTopRatedMovies();
      setMovies(data.results);
      setCurrentDataType("top-rated");
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film top rated: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUpcomingMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getUpcomingMovies();
      setMovies(data.results);
      setCurrentDataType("upcoming");
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film upcoming: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const data = await movieAPI.getGenres();
      setGenres(data.genres);
    } catch (err) {
      console.error("Gagal memuat genre:", err.message);
    }
  }, []);

  const filterByGenre = useCallback(async (genreId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieAPI.discoverByGenre(genreId);
      setMovies(data.results);
      setCurrentDataType("genre");
    } catch (err) {
      setError(`Gagal memfilter film: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback(
    async (query) => {
      try {
        setLoading(true);
        setError(null);
        if (query.trim() === "") {
          loadPopularMovies();
          return;
        }
        const data = await movieAPI.searchMovies(query);
        setMovies(data.results);
        setCurrentDataType("search");
      } catch (err) {
        setError(`Gagal mencari film: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [loadPopularMovies]
  );

  const loadMoviesByType = useCallback(
    async (type) => {
      switch (type) {
        case "popular":
          return loadPopularMovies();
        case "top-rated":
          return loadTopRatedMovies();
        case "upcoming":
          return loadUpcomingMovies();
        default:
          return loadPopularMovies();
      }
    },
    [loadPopularMovies, loadTopRatedMovies, loadUpcomingMovies]
  );

  const loadMovieVideos = useCallback(async (movieId) => {
    try {
      setVideosLoading(true);
      setVideosError(null);
      const data = await movieAPI.getMovieVideos(movieId);
      const youtubeTrailers = data.results.filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );
      setMovieVideos(youtubeTrailers);
    } catch (err) {
      setVideosError(`Gagal memuat video: ${err.message}`);
      setMovieVideos([]);
    } finally {
      setVideosLoading(false);
    }
  }, []);

  const loadMovieImages = useCallback(async (movieId) => {
    try {
      setImagesLoading(true);
      setImagesError(null);
      const data = await movieAPI.getMovieImages(movieId);
      const allImages = [
        ...data.backdrops.map((img) => ({ ...img, type: "backdrop" })),
        ...data.posters.map((img) => ({ ...img, type: "poster" })),
      ];
      const sortedImages = allImages.sort(
        (a, b) => b.vote_average - a.vote_average
      );
      setMovieImages(sortedImages.slice(0, 20));
    } catch (err) {
      setImagesError(`Gagal memuat gambar: ${err.message}`);
      setMovieImages([]);
    } finally {
      setImagesLoading(false);
    }
  }, []);

  const loadMovieCredits = useCallback(async (movieId) => {
    try {
      setCreditsLoading(true);
      setCreditsError(null);
      const data = await movieAPI.getMovieCredits(movieId);
      setMovieCredits(data.cast || []);
    } catch (err) {
      setCreditsError(`Gagal memuat credits: ${err.message}`);
      setMovieCredits([]);
    } finally {
      setCreditsLoading(false);
    }
  }, []);

  const loadMovieDetails = useCallback(async (movieId) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      console.log("Loading movie details for ID:", movieId); // Debug log
      const data = await movieAPI.getMovieDetails(movieId);
      console.log("Movie details loaded:", data); // Debug log
      setMovieDetail(data);
      return data;
    } catch (err) {
      console.error("Error loading movie details:", err); // Debug log
      console.error("Error details:", {
        message: err.message,
        status: err.status,
        response: err.response,
      });
      setDetailError(`Gagal memuat detail film: ${err.message}`);
      setMovieDetail(null);
      throw err;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const getPersonMovieCredits = useCallback(async (personId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieAPI.getPersonMovieCredits(personId);
      setMovies(data.cast || []);
    } catch (err) {
      setError(`Gagal memuat film person: ${err.message}`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetMovieMedia = useCallback(() => {
    setMovieVideos([]);
    setMovieImages([]);
    setMovieCredits([]);
    setMovieDetail(null);
    setVideosError(null);
    setImagesError(null);
    setCreditsError(null);
    setDetailError(null);
  }, []);

  useEffect(() => {
    loadPopularMovies();
    loadGenres();
    loadTrending;
  }, [loadPopularMovies, loadGenres, loadTrending]);

  return {
    movies,
    loading,
    error,
    genres,
    currentDataType,
    movieVideos,
    movieImages,
    movieCredits,
    movieDetail,
    trendingMovies,
    trendingPeople,
    trendingAll,
    trendingLoading,
    videosLoading,
    imagesLoading,
    creditsLoading,
    detailLoading,
    trendingError,
    videosError,
    imagesError,
    creditsError,
    detailError,
    searchMovies,
    loadPopularMovies,
    loadTopRatedMovies,
    loadUpcomingMovies,
    filterByGenre,
    loadMoviesByType,
    getPersonMovieCredits,
    loadMovieVideos,
    loadMovieImages,
    loadMovieCredits,
    loadMovieDetails,
    loadTrending,
    resetMovieMedia,
  };
};
