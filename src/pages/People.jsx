import { useSearchParams } from "react-router-dom";
import { useMovies } from "../hooks/useMovie";
import PeopleList from "../components/PeopleList";

const People = () => {
  const { trendingPeople, trendingLoading, trendingError } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const handleSearchUpdate = (newQuery) => {
    if (newQuery) {
      setSearchParams({ query: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <PeopleList
      trendingPeople={trendingPeople}
      trendingLoading={trendingLoading}
      trendingError={trendingError}
      searchQuery={query}
      onSearchUpdate={handleSearchUpdate}
    />
  );
};

export default People;
