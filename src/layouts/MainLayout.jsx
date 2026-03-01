import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import MovieDetail from "../components/MovieDetail";
import { useState } from "react";

const MainLayout = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const handleCloseDetail = () => setSelectedMovie(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      <header className="bg-transparent border-b border-white/10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <h1
            className="text-2xl font-light text-white tracking-widest uppercase cursor-pointer"
            onClick={() => navigate("/")}
          >
            MovieDB
          </h1>
        </div>
      </header>

      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Outlet context={{ handleMovieClick }} />
      </main>

      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default MainLayout;
