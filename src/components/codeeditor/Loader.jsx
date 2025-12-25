import React from "react";

function Loader() {
  return (
    <div className="p-3 w-full h-full animate-pulse flex flex-col gap-3">
      <div className="w-full h-4 bg-gray-500 rounded-xl"></div>
      <div className="w-full h-full bg-gray-600 rounded-xl"></div>
    </div>
  );
}

export default Loader;
