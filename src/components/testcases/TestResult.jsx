import React, { useEffect, useState } from "react";
import { SquareCheck, Terminal } from "lucide-react";
import TestResultLoader from "./TestResultLoader";
import DisplayTestCases from "./DisplayTestCases";
import DisplayRunTimeerror from "./DisplayRunTimeerror";
import DisplayAnswer from "./display answer/DisplayAnswer";

function TestResult({ loading, runbtnCliked, result }) {
  if (loading && runbtnCliked) {
    return <TestResultLoader />;
  }

  if (!result) {
    return (
      <div className="text-sm text-center text-textdarkish flex items-center justify-center h-full pt-20">
        You must run your code first
      </div>
    );
  }

  const [error, setError] = useState(result.result.error);
  const [solnStatus, setSolnStatus] = useState(
    error !== "" ? "Runtime Error" : ""
  );

  const [codeOutput, setCodeOutput] = useState(result.result.output);

  const [testCases, setTestCases] = useState(result.test_cases);

  const runTime = result.result.execution_time;

  useEffect(() => {
    if (error === "" && result.result.output.length === 0) {
      setError("You need to write a code");
      setSolnStatus("Runtime Error");
    }
  }, [error, solnStatus]);

  return (
    <div className="p-4 flex flex-col justify-center  h-full w-full">
      {solnStatus == "Runtime Error" ? (
        <DisplayRunTimeerror
          solnStatus={solnStatus}
          error={error}
          testCases={testCases}
          codeOutput={codeOutput}
        />
      ) : (
        <DisplayAnswer
          solnStatus={solnStatus}
          error={error}
          testCases={testCases}
          codeOutput={codeOutput}
          setSolnStatus={setSolnStatus}
          runTime={runTime}
        />
      )}
    </div>
  );
}

export default TestResult;
