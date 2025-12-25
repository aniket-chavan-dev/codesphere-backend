import React from "react";

function SubLoader() {
  const arr = [0, 1, 2, 3, 4, 5];
  const arr2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div className="p-2 animate-pulse">
      {arr2.map((val) => (
        <div className="flex gap-2 p-3" key={val}>
          {arr.map((index) => (
            <div key={index} className="w-20 h-7 bg-gray-500 rounded-lg"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SubLoader;
