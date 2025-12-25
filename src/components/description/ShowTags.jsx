import React from "react";
import { useState } from "react";
import {
  Tag,
  ChevronDown,
  Building2,
  ListTree,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function ShowTags({
  showCompanies,
  setShowCompanies,
  showTopics,
  setShowTopics,
  topicRef,
  companyRef,
  problem,
}) {
  const [showSimilarQuestions, setShowSimilarQuestions] = useState(false);
  const [showDiscussion, setShowDescussuion] = useState(false);

  if (!problem) {
    return <p className="text-sm text-red-500">Something went Wrong</p>;
  }
  let topics = problem.related_topics.split(",");
  let companies = problem.companies.split(",");

  const str = problem.similar_questions;

  const result = str
    .split("], [")
    .map((item) =>
      item
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((s) => s.trim())
    )
    .map(([title, url, difficulty]) => ({ title, url, difficulty }));

  let similarQuestions = result;

  return (
    <div>
      <div className="pt-4">
        <div ref={topicRef} className="pb-4 border-b-1 border-bordergrey ">
          <div
            className="flex justify-between cursor-pointer "
            onClick={() => setShowTopics((pre) => !pre)}
          >
            <div className="flex gap-3">
              <Tag size={18} />
              <div className="text-sm">Topics</div>
            </div>
            <div>
              <ChevronDown />
            </div>
          </div>

          <div
            className={`flex gap-2 transition-all duration-700 ease-in-out overflow-hidden ${
              showTopics ? "max-h-10" : "max-h-0"
            }`}
          >
            {topics.length !== 0
              ? topics.map((topic, index) => (
                  <div
                    className="p-2 bg-grey rounded-4xl text-sm text-textdarkish"
                    key={index}
                  >
                    {topic}
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div ref={companyRef} className="pb-4 border-b-1 border-bordergrey ">
          <div
            className="flex justify-between cursor-pointer "
            onClick={() => setShowCompanies((pre) => !pre)}
          >
            <div className="flex gap-3">
              <Building2 size={18} />
              <div className="text-sm">Comapnies</div>
            </div>
            <div>
              <ChevronDown />
            </div>
          </div>

          <div
            className={`flex gap-2 transition-all duration-700 ease-in-out overflow-hidden ${
              showCompanies ? "max-h-10" : "max-h-0"
            }`}
          >
            {companies.length !== 0
              ? companies.map((company, index) => (
                  <div
                    className="p-2 bg-grey rounded-4xl text-sm text-textdarkish"
                    key={index}
                  >
                    {company}
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="pb-4 border-b-1 border-bordergrey cursor-pointer">
          <div
            className="flex justify-between"
            onClick={() => setShowSimilarQuestions((pre) => !pre)}
          >
            <div className="flex gap-3">
              <ListTree size={18} />
              <div className="text-sm">Similar questions</div>
            </div>
            <div>
              <ChevronDown />
            </div>
          </div>

          <div
            className={`flex gap-2 transition-all duration-700 ease-in-out overflow-hidden flex-wrap ${
              showSimilarQuestions ? "max-h-23" : "max-h-0"
            }`}
          >
            {similarQuestions.length !== 0
              ? similarQuestions.map((question, index) => (
                  <Link
                    to={`/problems/${question.title.split(" ").join("-")}`}
                    className="p-2 bg-grey rounded-xl text-sm text-textdarkish"
                    key={index}
                  >
                    {question.title}
                  </Link>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowTags;
