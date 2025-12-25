import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MoveToAllSubmissions from "./common/MoveToAllSubmissions";
import CopyCom from "../common/CopyCom";
import { Check, NotepadText } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import api from "../../utilities/api";
import { Link } from "react-router-dom";
import {
  Contact,
  NotebookPen,
  Clock,
  Info,
  Sparkles,
  Cpu,
  Hand,
} from "lucide-react";

import PerformanceHistograms from "./PerformanceHistograms";
import { useNavigate } from "react-router-dom";

function Accepted({ submissionsAttributed }) {
  const { result } = submissionsAttributed;
  const { sub_data } = result;
  const { histogram_data } = sub_data;
  const { problem } = sub_data;

  const user = useSelector((state) => state.user.user);
  const isoTime = sub_data.created_at;
  const date = new Date(isoTime);

  const str = problem.similar_questions;

  const navigator = useNavigate();

  const similar_que_result = str
    .split("], [")
    .map((item) =>
      item
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((s) => s.trim())
    )
    .map(([title, url, difficulty]) => ({ title, url, difficulty }));

  let similarQuestions = similar_que_result;

  const [selectedGraph, setSelectedGrap] = useState("Runtime");
  const [selectedIndicator, setSelectedIndicater] = useState(0);
  const indicaters = ["blue", "red", "pink", "violet", "white", "yellow"];
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(false);

  const updateNotes = async () => {
    setIsLoading(true);
    try {
      const res = await api.put(
        `submissions/submit/note/${result.sub_data.id}/`,
        { text: text, indicater: indicaters[selectedIndicator] }
      );
      const data = await res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsShowing(true);
      setTimeout(() => {
        setIsShowing(false);
      }, 500);
    }
  };

  useEffect(() => {
    const delayUpdate = setTimeout(() => {
      if (text !== "") {
        updateNotes();
      }
    }, 1000);
    return () => clearTimeout(delayUpdate);
  }, [text]);

  useEffect(() => {
    updateNotes();
  }, [selectedIndicator]);

  const options = {
    year: "numeric",
    month: "short", // "Oct"
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  };

  const formattedDate = date.toLocaleString("en-US", options);

  return (
    <div className="w-full h-full md:p-4 flex flex-col overflow-auto gap-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">Accepted</span>{" "}
            <span className="text-sm text-textdarkish">
              {sub_data.total_test_cases}/{sub_data.total_test_cases} testcases
              passed
            </span>
          </div>
          <div>
            {user && (
              <div className="items-center ">
                <span className="text-blue-500">
                  {" "}
                  <Contact size={18} style={{ display: "inline" }} />
                </span>
                <span className="text-white">
                  {" "}
                  {user.first_name} {user.last_name}{" "}
                </span>
                <span className="text-sm text-textdarkish">
                  submitted at {formattedDate}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <button
            className="p-2 bg-green-500 rounded-lg md:rounded-xl flex gap-1 items-center  hover:bg-green-600 transition-all duration-75 cursor-pointer"
            onClick={() =>
              navigator(`/problems/${problem.id}/solution-post`, {
                state: { code: sub_data.code, title: problem.title },
              })
            }
          >
            <span>
              <NotebookPen size={18} />
            </span>
            <span className="hidden md:inline">Post Solution</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full p-3 border-1 border-bordergrey rounded-lg">
        {/* runtime and memory efficiency */}
        <div className="relative flex flex-col md:flex-row gap-4 items-center">
          <div
            className={`flex flex-col gap-2 w-full ${
              selectedGraph == "Runtime" ? "bg-dark" : "bg-grey"
            } p-3 cursor-pointer hover:bg-dark transition-all duration-300 hover:scale-103 rounded-lg ${
              selectedGraph != "Runtime" ? "text-textdarkish" : "text-white"
            }`}
            onClick={() => setSelectedGrap("Runtime")}
          >
            <div className="flex justify-between items-center group cursor-pointer ">
              <div className="flex gap-2 items-center">
                <span>
                  <Clock size={19} />
                </span>{" "}
                Runtime
              </div>
              <div>
                <span>
                  {" "}
                  <Info size={20} />
                </span>
                <div className="hidden group-hover:flex absolute top-1/2 left-1/2  p-2 overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-grey z-10 w-[75%] h-18 rounded-lg text-sm ">
                  this metric calculate the efficiency of your function with
                  respect to total submissions submitted by users
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="border-r-1 border-bordergrey p-2">
                {parseInt(sub_data.execution_time * 1000)}{" "}
                <span className="text-textdarkish">ms</span>
              </span>

              <span className="text-textdarkish">Beats</span>
              <span className="p-1">
                {" "}
                {histogram_data.user_percentiles.faster_than}%
              </span>
              <span
                className={`${
                  histogram_data.user_percentiles.faster_than > 74
                    ? "inline text-green-600 p-1 "
                    : "hidden"
                }`}
              >
                <Hand size={18} />
              </span>
            </div>
            <div className="flex gap-2 items-center ">
              <span className="ctm-bg">
                <Sparkles size={18} />
              </span>
              <span className="ctm-st">Analyze Complexity</span>
            </div>
          </div>

          <div
            className={`flex flex-col gap-2 w-full ${
              selectedGraph == "Memory" ? "bg-dark" : "bg-grey"
            } p-3 cursor-pointer hover:bg-dark transition-all duration-300 hover:scale-103 rounded-lg ${
              selectedGraph != "Memory" ? "text-textdarkish" : "text-white"
            }`}
            onClick={() => setSelectedGrap("Memory")}
          >
            <div className="flex justify-between items-center group cursor-pointer ">
              <div className="flex gap-2 items-center">
                <span>
                  <Cpu size={18} />{" "}
                </span>{" "}
                Memory
              </div>
            </div>
            <div className="flex items-center">
              <span className="border-r-1 border-bordergrey p-2">
                {parseInt(sub_data.memory_use)}{" "}
                <span className="text-textdarkish">MB</span>
              </span>{" "}
              <span className="text-textdarkish p-1">Beats</span>{" "}
              {histogram_data.user_percentiles.better_memory_than}%{" "}
              <span
                className={`${
                  histogram_data.user_percentiles.better_memory_than > 75
                    ? "inline text-green-600 p-1 "
                    : "hidden"
                }`}
              >
                <Hand size={18} />
              </span>
            </div>
            <div className="flex gap-2 items-center ">
              <span className="ctm-bg">
                <Sparkles size={16} />
              </span>
              <span className="ctm-st">Analyze Complexity</span>
            </div>
          </div>
        </div>
        {/* histogram for memory and runtime*/}
        <div>
          <PerformanceHistograms
            histogramData={histogram_data}
            selectedGraph={selectedGraph}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center text-sm text-textdarkish pt-2">
        <div className="border-r-2 border-bordergrey pr-2">Code</div>
        <div>{result.sub_data.lang}</div>
      </div>

      {/* code */}

      <div className="pt-2 group relative w-full overflow-auto rounded-lg">
        <SyntaxHighlighter language={result.sub_data.lang} style={oneDark}>
          {result.sub_data.code}
        </SyntaxHighlighter>
        <CopyCom text={result.sub_data.code} />
      </div>

      {/* More challenges */}
      <div>
        <h5 className="text-textdarkish">More challenges</h5>
        <div
          className={`flex gap-2 transition-all duration-700 ease-in-out overflow-hidden flex-wrap p-2`}
        >
          {similarQuestions.length !== 0
            ? similarQuestions.map((question, index) => (
                <Link
                  to={`/problems/${question.title.split(" ").join("-")}`}
                  className="p-2 bg-grey rounded-lg text-sm text-white flex gap-1 items-center"
                  key={index}
                >
                  <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                  <div> {question.title}</div>
                </Link>
              ))
            : ""}
        </div>
      </div>

      {/* notes */}

      <div className="w-full h-full flex-1 flex ">
        <textarea
          name="notes"
          className="w-full h-full bg-grey outline-none rounded-xl min-h-50 p-3 focus:ring-1 focus:ring-blue-500 resize-none mt-3 text-sm"
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="pt-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div
            className="w-5 h-5 border-1 border-blue-500  rounded-full "
            onClick={() => setSelectedIndicater(0)}
          >
            {selectedIndicator === 0 && <Check size={18} />}
          </div>
          <div
            className="w-5 h-5 border-1 border-red-500  rounded-full "
            onClick={() => setSelectedIndicater(1)}
          >
            {" "}
            {selectedIndicator === 1 && <Check size={18} />}
          </div>
          <div
            className="w-5 h-5 border-1 border-pink-500  rounded-full "
            onClick={() => setSelectedIndicater(2)}
          >
            {" "}
            {selectedIndicator === 2 && <Check size={18} />}
          </div>
          <div
            className="w-5 h-5 border-1 border-violet-500  rounded-full "
            onClick={() => setSelectedIndicater(3)}
          >
            {" "}
            {selectedIndicator === 3 && <Check size={18} />}
          </div>
          <div
            className="w-5 h-5 border-1 border-white  rounded-full "
            onClick={() => setSelectedIndicater(4)}
          >
            {" "}
            {selectedIndicator === 4 && <Check size={18} />}
          </div>
          <div
            className="w-5 h-5 border-1 border-yellow-500  rounded-full "
            onClick={() => setSelectedIndicater(5)}
          >
            {" "}
            {selectedIndicator === 5 && <Check size={18} />}
          </div>
        </div>
        <div className="text-sm text-textdarkish pr-2">
          <p>{isLoading ? "Saving.." : isShowing && "Saved"}</p>
        </div>
      </div>
    </div>
  );
}

export default Accepted;
