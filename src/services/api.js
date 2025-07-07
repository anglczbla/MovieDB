const API_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_APP_TMDB_BASE_URL;

export const movieAPI = {
  // Ambil film populer
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Search film
  searchMovies: async (query, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Ambil detail orang
  getPersonDetails: async (personId) => {
    const response = await fetch(
      `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Search orang
  searchPeople: async (query, page = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Detail film (enhanced with credits and videos)
  getMovieDetails: async (id) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );
    return response.json();
  },

  // Discover film berdasarkan filter (replace or complement getPopularMovies)
  discoverMovies: async (params = {}) => {
    const query = new URLSearchParams({
      api_key: API_KEY,
      language: "en-US",
      ...params, // Allow custom filters like sort_by, with_genres, etc.
    }).toString();
    const response = await fetch(`${BASE_URL}/discover/movie?${query}`);
    return response.json();
  },

  // Discover film berdasarkan genre
  discoverByGenre: async (genreId) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`
    );
    return response.json();
  },

  // Ambil genre
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil orang populer
  getPopularPeople: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Ambil tren semua (movie, TV, dll) harian
  getTrendingAllDay: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil tren film harian
  getTrendingMoviesDay: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil tren orang harian
  getTrendingPeopleDay: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/person/day?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil tanggal rilis film
  getMovieReleaseDates: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil film top rated
  getTopRatedMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Ambil film yang akan datang
  getUpcomingMovies: async (page = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    return response.json();
  },

  // Ambil video film
  getMovieVideos: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  // Ambil gambar film
  getMovieImages: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  getPersonMovieCredits: async (personId) => {
    // add cast
    const response = await fetch(
      `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },

  getMovieCredits: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
    );
    return response.json();
  },
};
