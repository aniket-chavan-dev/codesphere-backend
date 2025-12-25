import React from "react";

function SubAnsLoader() {
  return (
    <div className="flex flex-col animate-pulse p-4">
      <div className="flex gap-3 pt-3">
        <div className="w-20 h-5 bg-gray-700 rounded-lg"></div>
        <div className="w-full h-5 rounded-2xl bg-gray-700"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-5">
        <div className="w-full h-30 bg-gray-800 rounded-2xl"></div>
        <div className="w-full h-30 bg-gray-800 rounded-3xl"></div>
      </div>

      <div className="flex gap-5 pt-5  pb-5">
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
        <div className="h-60 w-9 bg-gray-800"></div>
      </div>

      <div className="flex gap-2">
        <div className="pt-10 h-28 w-full bg-gray-800 rounded-3xl"></div>
      </div>
    </div>
  );
}

export default SubAnsLoader;
