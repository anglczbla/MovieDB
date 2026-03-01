import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import TrendingSection from "../components/TrendingSection";
import MovieList from "../components/MovieList";
import { movieAPI } from "../services/api";

const Home = () => {
  const { handleMovieClick } = useOutletContext();
  const navigate = useNavigate();

  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [topRatedError, setTopRatedError] = useState(null);
  const [upcomingError, setUpcomingError] = useState(null);

  useEffect(() => {
    loadTopRatedMovies();
    loadUpcomingMovies();
  }, []);

  const loadTopRatedMovies = async () => {
    try {
      setTopRatedLoading(true);
      const data = await movieAPI.getTopRatedMovies();
      setTopRatedMovies(data.results);
    } catch (err) {
      setTopRatedError(err.message);
    } finally {
      setTopRatedLoading(false);
    }
  };

  const loadUpcomingMovies = async () => {
    try {
      setUpcomingLoading(true);
      const data = await movieAPI.getUpcomingMovies();
      setUpcomingMovies(data.results);
    } catch (err) {
      setUpcomingError(err.message);
    } finally {
      setUpcomingLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (query && query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} isHero={true} />
      <TrendingSection onMovieClick={handleMovieClick} />
      <MovieList
        title="Top Rated Movies"
        movies={topRatedMovies}
        loading={topRatedLoading}
        error={topRatedError}
        onMovieClick={handleMovieClick}
      />
      <MovieList
        title="Upcoming Movies"
        movies={upcomingMovies}
        loading={upcomingLoading}
        error={upcomingError}
        onMovieClick={handleMovieClick}
      />
    </div>
  );
};

export default Home;
