import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [currentDataType, setCurrentDataType] = useState('popular'); // Track data type

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

  // Fungsi untuk memfilter film berdasarkan genre (menggunakan API)
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

  // Fungsi untuk mendapatkan film berdasarkan tipe data
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

  return {
    movies,
    loading,
    error,
    genres,
    currentDataType,
    searchMovies,
    loadPopularMovies,
    loadTopRatedMovies,
    loadUpcomingMovies,
    filterByGenre,
    loadMoviesByType
  };
};