import React from "react";
import { Link } from "react-router-dom";

function Problem({ problem, index }) {
  let diff = `${problem.difficulty}`;
  diff = diff.slice(0, 3).toLowerCase();
  let title = `${problem.title}`;
  title = title.split(" ").join("-");

  return (
    <Link
      className="flex justify-between px-4 items-center min-h-12 cursor-pointer border-b-1 border-gray-600"
      key={index}
      to={`problems/${title}`}
    >
      <div className="flex justify-between gap-5 items-center">
        <div className="relative group flex justify-between gap-5 items-center p-2 hover:bg-gray-800 rounded">
          {/* Status */}
          <div>
            {problem.status === "solved" ? (
              <span className="text-green-400">✔</span>
            ) : problem.status === "attempted" ? (
              <span className="text-gray-500">◯</span>
            ) : null}
          </div>
          {/* Tooltip */}
          <div
            className="absolute  ml-2 top-1 left-0 transform -translate-y-1/2 
                  opacity-0 group-hover:opacity-100 transition-opacity
                  bg-gray-800 text-white text-sm rounded-l-full whitespace-nowrap z-10"
          >
            Solved
          </div>
        </div>

        <div className="truncate w-40 sm:w-full">
          {problem.id - 1825} {problem.title}
        </div>
      </div>
      <div className="flex justify-between gap-5 items-center">
        <div className="hidden sm:block">{`${problem.acceptance_rate.toFixed(
          2
        )}%`}</div>
        <div>{diff}</div>
      </div>
    </Link>
  );
}

export default Problem;
