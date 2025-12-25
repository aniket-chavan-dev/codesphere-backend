import { Tag } from "lucide-react";
import React, { useRef, useState } from "react";
import ShowTags from "./ShowTags";
import PublicTestCases from "./PublicTestCases";
import ScalatonLoader from "./ScalatonLoader";
import Constraints from "./Constraints";

function Description({ isLoading, problem }) {
  const [showTopics, setShowTopics] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const topicRef = useRef(null);
  const companyRef = useRef(null);

  if (isLoading) return <ScalatonLoader />;
  if (!problem)
    return <p className="text-sm text-red-200">Problem not found</p>;

  let examplesArr = [];
  let constaintsArr = [];
  let completeDes = `${problem.description}`;
  let splitedWithExample = completeDes.split("Example");
  let sizeOfSplitEx = splitedWithExample.length;
  for (let i = 1; i < sizeOfSplitEx - 1; i++) {
    examplesArr.push(splitedWithExample[i]);
  }
  let splitWithConstraints =
    splitedWithExample[sizeOfSplitEx - 1].split("Constraints:");
  let onlyDes = `${splitedWithExample[0]}`;
  examplesArr.push(splitWithConstraints[0]);
  if (splitWithConstraints.length === 2)
    constaintsArr.push(splitWithConstraints[1]);

  return (
    <div className="w-full flex flex-col justify-start p-4 bg-problemdark">
      <div className="text-2xl font-semibold">
        {problem.id - 1825} {problem.title}
      </div>

      {/* Difficulty + Buttons */}
      <div className="flex gap-3 items-center pt-3">
        <div
          className={`p-2 bg-grey rounded-4xl text-sm ${
            problem.difficulty === "Easy"
              ? "text-green-400"
              : problem.difficulty === "Medium"
              ? "text-yellow-300"
              : "text-red-500"
          }`}
        >
          {problem.difficulty}
        </div>
        <button
          className="flex items-center text-sm gap-2 p-2 rounded-4xl bg-grey hover:opacity-80 transition duration-100 cursor-pointer"
          onClick={() => {
            setShowTopics(true);
            topicRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Tag size={18} />
          Topics
        </button>
        <button
          className="p-2 rounded-4xl bg-grey text-yellow-400 hover:opacity-80 transition duration-100 cursor-pointer"
          onClick={() => {
            setShowCompanies(true);
            companyRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Companies
        </button>
      </div>

      {/* Description */}
      <div className="text-sm whitespace-pre-line pt-3">{onlyDes}</div>

      {/* Examples & Constraints */}
      <div>
        <PublicTestCases examplesArr={examplesArr} />
      </div>
      <Constraints constaintsArr={constaintsArr} />

      {/* Stats */}
      <div className="pt-6 flex gap-3 pb-5 border-b border-bordergrey">
        <p>
          <span className="text-textdarkish">Accepted:</span>{" "}
          {problem.acceptance_count}/
          <span className="text-textdarkish">{problem.submissions_count}</span>
        </p>
        <p>
          <span className="text-textdarkish">Acceptance Rate:</span>{" "}
          {problem.acceptance_rate.toFixed(2)}%
        </p>
      </div>

      {/* Tags & Companies */}
      <ShowTags
        showTopics={showTopics}
        setShowTopics={setShowTopics}
        showCompanies={showCompanies}
        setShowCompanies={setShowCompanies}
        topicRef={topicRef}
        companyRef={companyRef}
        problem={problem}
      />

      {/* Footer */}
      <div className="pt-8">
        <p className="text-sm text-textdarkish">
          Copyright © 2025 CodeSphere. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Description;
