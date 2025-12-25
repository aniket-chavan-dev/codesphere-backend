import React, { useEffect, useState } from "react";
import { Search, Calendar, ThumbsUp, Eye, MessageCircle } from "lucide-react";
import CustomSortTag from "./CustomSortTag";
import SolutionLoader from "./SolutionLoader";
import api from "../../utilities/api";
import DetailedSolution from "./DetailedSolution";

function Solutions({ problem, leftPanelDiv }) {
  const [sortBy, setSortBy] = useState("Recent");
  const [selectedTag, setSelectedtag] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isShowDetailedSolution, setIsShowDetailedSolution] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState(null);
  const [isLoadUserSolutions, setIsLoadUserSolutions] = useState(false);

  const fetchedSolutions = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    let res;
    try {
      if (isLoadUserSolutions) {
        res = await api.get(
          `solutions/list/user/solutions/${problem.id}?page=${page}`
        );
      } else {
        res = await api.get(
          `solutions/listSolutions/${problem.id}?page=${page}`
        );
      }
      const data = res.data;

      if (page === 1) {
        setSolutions(data.results);
        console.log(data.results);
      } else {
        setSolutions((prev) => [...prev, ...data.results]);
      }

      if (!data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error occurred during fetching solutions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollHandler = () => {
    const el = leftPanelDiv?.current;
    if (!el) return;

    const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10; // 10px threshold

    if (bottom && hasMore) {
      console.log("Reached bottom → Loading next page...");
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const el = leftPanelDiv?.current;
    if (!el) return;

    el.addEventListener("scroll", scrollHandler);
    console.log("Scroll listener attached to left panel div");

    return () => {
      el.removeEventListener("scroll", scrollHandler);
    };
  }, [leftPanelDiv, hasMore]);

  useEffect(() => {
    fetchedSolutions();
  }, [page, isLoadUserSolutions]);

  useEffect(() => {
    fetchedSolutions();
    console.log(isShowDetailedSolution);
  }, [isShowDetailedSolution]);

  useEffect(() => {
    if (selectedSolutionId != null) {
      setIsShowDetailedSolution(true);
    }
  }, [selectedSolutionId]);

  const formatedDate = (date) => {
    const con_date = new Date(date);
    return con_date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isShowDetailedSolution)
    return (
      <DetailedSolution
        selectedSolutionId={selectedSolutionId}
        setIsShowDetailedSolution={setIsShowDetailedSolution}
        setSelectedSolutionId={setSelectedSolutionId}
      />
    );

  return (
    <div className="p-4 w-full flex flex-col">
      {/* Search and Sort */}
      <div className="flex justify-between">
        <CustomSortTag sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* Filter Tags */}
      <div className="flex gap-2 items-center p-2 text-textdarkish">
        {["All", "My Solution"].map((tag) => (
          <div
            key={tag}
            className={`p-1 rounded-lg cursor-pointer ${
              selectedTag === tag
                ? "bg-white text-black"
                : "bg-grey hover:bg-bordergrey"
            }`}
            onClick={() => {
              setSelectedtag(tag);
              if (tag == "My Solution") {
                setIsLoadUserSolutions(true);
                setPage(1);
                setHasMore(true);
              } else {
                setIsLoadUserSolutions(false);
                setPage(1);
                setHasMore(true);
              }
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Solutions list */}
      <div className="p-2 flex flex-col gap-4">
        {solutions.length > 0 &&
          solutions.map((solution, index) => (
            <div
              className="flex gap-3 border-b border-bordergrey px-2 py-3 cursor-pointer"
              key={index}
              onClick={() => {
                setSelectedSolutionId(solution.id);
              }}
            >
              <div className="w-8 h-8 mt-6 bg-black rounded-full flex items-center justify-center text-blue-600">
                A
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center text-textdarkish">
                  <p className="text-sm">
                    {solution.user.first_name} {solution.user.last_name}
                  </p>
                  <Calendar size={20} />
                  <p>{formatedDate(solution.created_at)}</p>
                </div>
                <h3 className="text-lg font-semibold">{solution.title}</h3>
                <div className="flex gap-3 items-center text-textdarkish">
                  <div className="flex gap-2 items-center">
                    <ThumbsUp
                      size={18}
                      fill={solution.is_liked ? "white" : ""}
                    />
                    <span>{solution.like_count}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Eye size={20} />
                    <span>{solution.views_count}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MessageCircle size={18} />
                    <p>{solution.comments.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {isLoading && <SolutionLoader />}
        {!isLoading && solutions.length === 0 && <div>No Solutions Yet</div>}
      </div>
    </div>
  );
}

export default Solutions;
