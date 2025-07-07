import React, { useState, useEffect } from "react";
import { movieAPI } from "../services/api";

const PeopleList = ({ trendingPeople, trendingLoading, trendingError }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Filter trending people based on search query
  const filteredTrendingPeople = trendingPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load popular people for pagination
  useEffect(() => {
    if (!isSearching) {
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
          setError("Failed to load people", err);
        } finally {
          setLoading(false);
        }
      };

      fetchPeople();
    }
  }, [page, isSearching]);

  
  const searchPeople = async (query) => {
    if (query.trim() === "") {
      setIsSearching(false);
      setPage(1);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const response = await movieAPI.searchPeople(query);
      setPeople(response.results || []);
    } catch (err) {
      setError("Failed to search people", err);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchPeople(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const loadMore = () => {
    if (!isSearching) {
      setPage((prev) => prev + 1);
    }
  };

  // Use trending people if available and not searching
  const displayPeople =
    searchQuery.trim() === "" && !isSearching
      ? trendingPeople.length > 0
        ? trendingPeople
        : people
      : isSearching
      ? people
      : filteredTrendingPeople;

  const displayLoading =
    searchQuery.trim() === "" && !isSearching
      ? trendingLoading || (loading && page === 1)
      : loading;

  const displayError =
    searchQuery.trim() === "" && !isSearching ? trendingError || error : error;

  if (displayLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{displayError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-yellow-400">
          {searchQuery.trim() !== "" ? "Search Results" : "Popular People"}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-64 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearching(false);
                setPage(1);
              }}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {displayPeople.length === 0 && !displayLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {searchQuery.trim() !== ""
              ? "No people found for your search."
              : "No people available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayPeople.map((person) => (
            <div
              key={person.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                      : "/placeholder-person.jpg"
                  }
                  alt={person.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-person.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">
                  {person.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  Popularity: {person.popularity?.toFixed(1)}
                </p>
                {person.known_for && person.known_for.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Known for:</p>
                    <p className="text-sm text-gray-300 truncate">
                      {person.known_for
                        .map((item) => item.title || item.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More button - only show when not searching and using paginated data */}
      {!isSearching &&
        people.length > 0 &&
        searchQuery.trim() === "" &&
        trendingPeople.length === 0 && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
    </div>
  );
};

export default PeopleList;
