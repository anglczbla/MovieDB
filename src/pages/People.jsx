import { useMovies } from "../hooks/useMovie";
import PeopleList from "../components/PeopleList";

const People = () => {
  const { trendingPeople, trendingLoading, trendingError } = useMovies();

  return (
    <PeopleList
      trendingPeople={trendingPeople}
      trendingLoading={trendingLoading}
      trendingError={trendingError}
    />
  );
};

export default People;
