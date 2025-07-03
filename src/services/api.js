const API_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_APP_TMDB_BASE_URL;

export const movieAPI = {
  // Ambil film populer
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    return response.json();
  },

  // Search film
  searchMovies: async (query, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
    );
    return response.json();
  },

  // Detail film
  getMovieDetail: async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return response.json();
  },

  discoverByGenre: async (genreId) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    return response.json();
  },

  // Ambil genre
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.json();
  },
};
