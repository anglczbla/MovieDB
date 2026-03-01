import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Popular from "./pages/Popular";
import TopRated from "./pages/TopRated";
import Upcoming from "./pages/Upcoming";
import Search from "./pages/Search";
import Genres from "./pages/Genres";
import People from "./pages/People";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="popular" element={<Popular />} />
        <Route path="genres" element={<Genres />} />
        <Route path="top-rated" element={<TopRated />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="people" element={<People />} />
      </Route>
    </Routes>
  );
}

export default App;
