import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [currentDataType, setCurrentDataType] = useState('popular');
  
  // State baru untuk video dan gambar
  const [movieVideos, setMovieVideos] = useState([]);
  const [movieImages, setMovieImages] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const [imagesError, setImagesError] = useState(null);

  useEffect(() => {
    loadPopularMovies();
    loadGenres();
  }, []);

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getPopularMovies();
      setMovies(data.results);
      setCurrentDataType('popular');
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film populer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTopRatedMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getTopRatedMovies();
      setMovies(data.results);
      setCurrentDataType('top-rated');
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film top rated: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getUpcomingMovies();
      setMovies(data.results);
      setCurrentDataType('upcoming');
      setError(null);
    } catch (err) {
      setError(`Gagal memuat film upcoming: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const data = await movieAPI.getGenres();
      setGenres(data.genres);
    } catch (err) {
      console.error('Gagal memuat genre:', err.message);
    }
  };

  const filterByGenre = async (genreId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await movieAPI.discoverByGenre(genreId);
      setMovies(data.results);
      setCurrentDataType('genre');
    } catch (err) {
      setError(`Gagal memfilter film: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      if (query.trim() === '') {
        loadPopularMovies();
        return;
      }
      
      const data = await movieAPI.searchMovies(query);
      setMovies(data.results);
      setCurrentDataType('search');
    } catch (err) {
      setError(`Gagal mencari film: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMoviesByType = async (type) => {
    switch (type) {
      case 'popular':
        return loadPopularMovies();
      case 'top-rated':
        return loadTopRatedMovies();
      case 'upcoming':
        return loadUpcomingMovies();
      default:
        return loadPopularMovies();
    }
  };

  // 🎬 FUNGSI BARU: Load video film
  const loadMovieVideos = async (movieId) => {
    try {
      setVideosLoading(true);
      setVideosError(null);
      
      const data = await movieAPI.getMovieVideos(movieId);
      
      // Filter untuk ambil trailer YouTube saja
      const youtubeTrailers = data.results.filter(
        video => video.site === 'YouTube' && 
                 (video.type === 'Trailer' || video.type === 'Teaser')
      );
      
      setMovieVideos(youtubeTrailers);
    } catch (err) {
      setVideosError(`Gagal memuat video: ${err.message}`);
      setMovieVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  // 🖼️ FUNGSI BARU: Load gambar film
  const loadMovieImages = async (movieId) => {
    try {
      setImagesLoading(true);
      setImagesError(null);
      
      const data = await movieAPI.getMovieImages(movieId);
      
      // Gabungkan backdrop dan poster
      const allImages = [
        ...data.backdrops.map(img => ({ ...img, type: 'backdrop' })),
        ...data.posters.map(img => ({ ...img, type: 'poster' }))
      ];
      
      // Sort berdasarkan vote average (gambar terbaik dulu)
      const sortedImages = allImages.sort((a, b) => b.vote_average - a.vote_average);
      
      setMovieImages(sortedImages.slice(0, 20)); // Ambil 20 gambar terbaik
    } catch (err) {
      setImagesError(`Gagal memuat gambar: ${err.message}`);
      setMovieImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  // 🧹 FUNGSI BARU: Reset video dan gambar
  const resetMovieMedia = () => {
    setMovieVideos([]);
    setMovieImages([]);
    setVideosError(null);
    setImagesError(null);
  };

  return {
    // State utama
    movies,
    loading,
    error,
    genres,
    currentDataType,
    
    // State video dan gambar
    movieVideos,
    movieImages,
    videosLoading,
    imagesLoading,
    videosError,
    imagesError,
    
    // Fungsi utama
    searchMovies,
    loadPopularMovies,
    loadTopRatedMovies,
    loadUpcomingMovies,
    filterByGenre,
    loadMoviesByType,
    
    // Fungsi baru
    loadMovieVideos,
    loadMovieImages,
    resetMovieMedia
  };
};