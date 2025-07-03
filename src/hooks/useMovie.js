import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    loadPopularMovies();
    loadGenres();
  }, []);

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      const data = await movieAPI.getPopularMovies();
      setMovies(data.results);
    } catch (err) {
      setError(`Gagal memuat film populer: ${err.message}`);
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

  const searchMovies = async (query) => {
    try {
      setLoading(true);
      if (query.trim() === '') {
        loadPopularMovies();
        return;
      }
      const data = await movieAPI.searchMovies(query);
      setMovies(data.results);
    } catch (err) {
      setError(`Gagal mencari film: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    loading,
    error,
    genres,
    searchMovies,
    loadPopularMovies
  };
};