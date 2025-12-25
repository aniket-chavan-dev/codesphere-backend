// src/pages/Problems.jsx
import { useEffect, useState, useCallback } from "react";
import api from "../utilities/api";
import Problem from "../components/Problem";
import Loader from "../components/Loader";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalLoadedProblems, setLoadedProblems] = useState([]);
  const [error, setError] = useState(null);
  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/problems/problemset/?page=${page}`);
      const data = res.data;
      setProblems((pre) => [...pre, ...data.results]);
      setLoadedProblems((pre) => [...pre, ...data.results]);
    } catch (error) {
      setError("No problem found");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProblemsbySearch = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/problems/problemset/?search=${search}`);
      const data = res.data;
      setProblems(data.results);
      setLoadedProblems(data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollHandler = async () => {
    if (
      window.document.documentElement.scrollTop + window.innerHeight + 1 >=
      window.document.documentElement.scrollHeight
    ) {
      setPage((pre) => pre + 1);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      fetchProblemsbySearch();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const filterByLevelProblems = (level) => {
    if (level === "all") {
      setProblems(totalLoadedProblems);
      return;
    }
    const filterdProblems = totalLoadedProblems.filter(
      (problem) => problem.difficulty.toLowerCase() == level
    );
    setProblems(filterdProblems);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark text-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
      {/* Sidebar for desktop */}
      <aside className="w-64 bg-dark p-4 hidden md:block overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Filter</h2>
        <ul className="space-y-2">
          {["all", "easy", "medium", "hard"].map((level, index) => (
            <li key={index}>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  difficulty === level
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => {
                  setDifficulty(level);
                  filterByLevelProblems(level);
                }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Mobile Filter Toggle */}
        <div className="flex justify-between items-center mb-4 md:hidden overflow-y-auto">
          <input
            type="text"
            placeholder="Search problems..."
            className="flex-1 p-2 rounded bg-gray-800 text-gray-200 border border-gray-600 mr-2"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-3 py-2 bg-blue-600 rounded"
            onClick={() => setShowFilterMobile(!showFilterMobile)}
          >
            Filter
          </button>
        </div>

        {/* Mobile Filter Menu */}
        {showFilterMobile && (
          <div className="bg-gray-800 p-3 rounded mb-4 space-y-2 md:hidden">
            {["all", "easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                className={`w-full text-left px-3 py-2 rounded ${
                  difficulty === level
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => {
                  setDifficulty(level);
                  filterByLevelProblems(level);
                }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Search bar for desktop */}
        <div className="mb-4 hidden md:block">
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full p-2 rounded bg-gray-800 text-gray-200 "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto h-full my-auto flex-1">
          {problems.map((ele, index) => (
            <Problem problem={ele} key={index} />
          ))}
          {isLoading ? <Loader /> : null}
          {error != null && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Problems;
