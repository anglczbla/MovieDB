import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { movieAPI } from "../services/api";

const PeopleList = ({
  trendingPeople,
  trendingLoading,
  trendingError,
  searchQuery,
  onSearchUpdate,
}) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(searchQuery.trim() !== "");

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setIsSearching(searchQuery.trim() !== "");
  }, [searchQuery]);

  // Load popular people for pagination
  useEffect(() => {
    if (!isSearching && searchQuery.trim() === "") {
      const fetchPeople = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await movieAPI.getPopularPeople(page);
          if (page === 1) {
            setPeople(response.results || []);
          } else {
            setPeople((prev) => [...prev, ...(response.results || [])]);
          }
        } catch (err) {
          setError("Failed to load people");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPeople();
    }
  }, [page, isSearching, searchQuery]);

  useEffect(() => {
    const searchPeople = async (query) => {
      if (query.trim() === "") {
        setPeople([]);
        setPage(1);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setLoading(true);
      setError(null);

      try {
        const response = await movieAPI.searchPeople(query);
        setPeople(response.results || []);
      } catch (err) {
        setError("Failed to search people");
        setPeople([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim() !== "") {
      searchPeople(searchQuery);
    }
  }, [searchQuery]);

  const debounceTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onSearchUpdate(query);
    }, 500);
  };

  // Cleanup timeout saat component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const loadMore = () => {
    if (!isSearching && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const displayPeople =
    searchQuery.trim() === ""
      ? trendingPeople.length > 0
        ? trendingPeople
        : people
      : people;

  const displayLoading =
    searchQuery.trim() === ""
      ? trendingLoading || (loading && page === 1)
      : loading;

  const displayError =
    searchQuery.trim() === "" ? trendingError || error : error;

  if (displayLoading && page === 1 && searchQuery.trim() === "") {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-light text-white tracking-wide">
          {searchQuery.trim() !== "" ? "Search Results" : "Popular People"}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search people..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-64 px-4 py-2 bg-[#1a1a1a] text-white font-light rounded-full border border-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/5 transition-all"
          />
          {localSearchQuery && (
            <button
              onClick={() => {
                setLocalSearchQuery("");
                onSearchUpdate("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {displayError && (
        <div className="text-center py-8">
          <p className="text-red-500">{displayError}</p>
        </div>
      )}

      {displayPeople.length === 0 && !displayLoading && !displayError ? (
        <div className="text-center py-8">
          <p className="text-gray-400 font-light">
            {searchQuery.trim() !== ""
              ? "No people found for your search."
              : "No people available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayPeople.map((person) => (
              <div
                key={person.id}
                className="group relative rounded-xl overflow-hidden bg-[#111] hover:shadow-xl hover:shadow-white/5 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-auto aspect-[2/3] overflow-hidden">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                        : "/placeholder-person.jpg"
                    }
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-person.jpg";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-medium text-white line-clamp-1">
                    {person.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-300 font-light line-clamp-1">
                      {person.known_for && person.known_for.length > 0
                        ? person.known_for
                            .map((item) => item.title || item.name)
                            .join(", ")
                        : "Actor"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-white shrink-0 ml-2">
                      <Star size={12} className="fill-white text-white" />
                      <span className="font-medium">
                        {person.popularity?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && searchQuery.trim() !== "" && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </>
      )}

      {searchQuery.trim() === "" &&
        !isSearching &&
        people.length > 0 &&
        trendingPeople.length === 0 && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-[#1a1a1a] border border-white/10 text-white rounded-full font-light hover:bg-white hover:text-black hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
    </div>
  );
};

export default PeopleList;
