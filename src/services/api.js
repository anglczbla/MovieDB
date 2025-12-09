const API_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_APP_TMDB_BASE_URL;

const fetchWithHandling = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Unexpected response from API:", text.slice(0, 500));
    throw new Error(
      `Invalid JSON response from API (likely HTML error page). Check console for details.`
    );
  }

  return response.json();
};

export const movieAPI = {
  // Ambil film populer
  getPopularMovies: async (page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
  },

  // Search film
  searchMovies: async (query, page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}`
    );
  },

  // Ambil detail orang
  getPersonDetails: async (personId) => {
    return fetchWithHandling(
      `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`
    );
  },

  // Search orang
  searchPeople: async (query, page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}`
    );
  },

  // Detail film (enhanced with credits and videos)
  getMovieDetails: async (id) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    );
  },

  // Discover film berdasarkan filter (replace or complement getPopularMovies)
  discoverMovies: async (params = {}) => {
    const query = new URLSearchParams({
      api_key: API_KEY,
      language: "en-US",
      ...params, // Allow custom filters like sort_by, with_genres, etc.
    }).toString();
    return fetchWithHandling(`${BASE_URL}/discover/movie?${query}`);
  },

  // Discover film berdasarkan genre
  discoverByGenre: async (genreId) => {
    return fetchWithHandling(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`
    );
  },

  // Ambil genre
  getGenres: async () => {
    return fetchWithHandling(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil orang populer
  getPopularPeople: async (page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
  },

  // Ambil tren semua (movie, TV, dll) harian
  getTrendingAllDay: async () => {
    return fetchWithHandling(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil tren film harian
  getTrendingMoviesDay: async () => {
    return fetchWithHandling(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil tren orang harian
  getTrendingPeopleDay: async () => {
    return fetchWithHandling(
      `${BASE_URL}/trending/person/day?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil tanggal rilis film
  getMovieReleaseDates: async (movieId) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil film top rated
  getTopRatedMovies: async (page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
    );
  },

  // Ambil film yang akan datang
  getUpcomingMovies: async (page = 1) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
    );
  },

  // Ambil video film
  getMovieVideos: async (movieId) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
  },

  // Ambil gambar film
  getMovieImages: async (movieId) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}&language=en-US`
    );
  },

  getPersonMovieCredits: async (personId) => {
    return fetchWithHandling(
      `${BASE_URL}/person/${personId}/movie_credits?api_key=${API_KEY}&language=en-US`
    );
  },

  getMovieCredits: async (movieId) => {
    return fetchWithHandling(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
    );
  },
};
