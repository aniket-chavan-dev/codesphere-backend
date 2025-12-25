import React from "react";

function SolutionLoader() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className=" animate-pulse w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 pt-7">
        {arr.map((val) => (
          <div className="flex gap-3" key={val}>
            <div className="w-8 h-8 rounded-full bg-gray-500 mt-3"></div>
            <div className="w-full flex flex-col gap-3">
              <div className="w-full h-4 bg-gray-500 rounded-lg"></div>
              <div className="w-full h-4 bg-gray-500 rounded-lg"></div>
              <div className="w-40 h-4 bg-gray-500"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SolutionLoader;
