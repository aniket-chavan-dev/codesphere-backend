import React, { useState, useEffect } from "react";
import { SquareCheck, Terminal } from "lucide-react";
import DisplayTestCases from "./DisplayTestCases";
import TestResult from "./TestResult";
import parseTestCases from "../../utilities/parsetestcases";
import { useSelector, useDispatch } from "react-redux";
import { setTestCasesGlobally } from "../../slices/testcasesSlice";
import { setTest_CasesGlobally } from "../../slices/testcasesSlice";

function TestCases() {
  const [selectedTab, setSelectedTab] = useState("Test Cases");
  const dispatch = useDispatch();
  const problem = useSelector((state) => state.testcases.problem);
  const { result, loading, runbtnCliked } = useSelector(
    (state) => state.pubTestResult
  );

  useEffect(() => {
    if (problem) {
      const problemText = problem.description;
      const result = parseTestCases(problemText, problem.title);
      dispatch(setTestCasesGlobally(result));
      dispatch(setTest_CasesGlobally(result.test_cases));
    }
  }, [problem, dispatch]);

  useEffect(() => {
    if (runbtnCliked) {
      setSelectedTab("Test Result");
    } else {
      setSelectedTab("Test Cases");
    }
  }, [runbtnCliked]);

  return (
    <div className="border-2 border-grey rounded-xl bg-problemdark md:overflow-auto">
      <div className="flex gap-3 items-center bg-grey p-2 rounded-tl-lg h-9">
        <div
          className={`flex gap-2 items-center cursor-pointer rounded-lg hover:bg-bordergrey p-1`}
          onClick={() => setSelectedTab("Test Cases")}
        >
          <div className="text-green-400">
            <SquareCheck size={18} />
          </div>
          <div
            className={`${
              selectedTab === "Test Cases" ? "text-white" : "text-textdarkish"
            }`}
          >
            Test Cases
          </div>
        </div>
        <div
          className="flex gap-2 items-center cursor-pointer rounded-lg hover:bg-bordergrey p-1"
          onClick={() => setSelectedTab("Test Result")}
        >
          <div className="text-green-400">
            <Terminal size={18} />
          </div>
          <div
            className={`${
              selectedTab === "Test Result" ? "text-white" : "text-textdarkish"
            }`}
          >
            Test Result
          </div>
        </div>
      </div>

      <div className="flex-1">
        {selectedTab === "Test Cases" && <DisplayTestCases />}
        {selectedTab === "Test Result" && (
          <TestResult
            loading={loading}
            runbtnCliked={runbtnCliked}
            result={result}
          />
        )}
      </div>
    </div>
  );
}

export default TestCases;
