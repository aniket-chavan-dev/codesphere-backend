import React from "react";

function TestResultLoader() {
  return (
    <div className="w-full h-full animate-pulse p-4">
      <div className="flex gap-3 items-center ">
        <div className="h-5 w-20 rounded-xl bg-gray-500"></div>
        <div className="h-5 w-20 rounded-xl bg-gray-500"></div>
        <div className="h-5 w-20 rounded-xl bg-gray-500"></div>
      </div>

      <div className="flex flex-col gap-3 pt-4 ">
        <div className="w-full h-5 bg-gray-500 rounded-4xl"></div>
        <div className="w-full h-5 bg-gray-500 rounded-4xl"></div>
        <div className="w-full h-5 bg-gray-500 rounded-4xl"></div>
        <div className="w-full h-5 bg-gray-500 rounded-4xl"></div>
      </div>
    </div>
  );
}

export default TestResultLoader;
