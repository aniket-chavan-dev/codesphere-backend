import React, { useState } from "react";
import { SquareCheck, SquareX } from "lucide-react";
import { getInputArr } from "../../../utilities/helper";
import DisplayInputOutput from "../DisplayInputOutput";
import DisplayOutputs from "./DisplayOutputs";

function DisplayAnswer({
  solnStatus,
  error,
  testCases,
  codeOutput,
  setSolnStatus,
  runTime,
}) {
  const [selectedTestCase, setSelectedTestcase] = useState(0);
  const expectedOpArr = testCases.map((ele) => {
    return ele.expected_output;
  });

  let inputArr = getInputArr(testCases);

  let statusArr = [];
  let isAccepted = true;
  expectedOpArr.map((val, index) => {
    if (typeof val == "object") {
      let status = codeOutput[index] === `[${val.join(", ")}]` ? "r" : "w";
      if (status == "w") {
        setSolnStatus("Wrong Answer");
        isAccepted = false;
      }
      statusArr.push(status);
    } else {
      let status = codeOutput[index] == `${val}` ? "r" : "w";
      if (status == "w") {
        setSolnStatus("Wrong Answer");
        isAccepted = false;
      }
      statusArr.push(status);
    }
  });

  if (isAccepted) setSolnStatus("Accepted");

  return (
    <div className="fex flex-col h-full w-full">
      <div className="flex gap-3 items-center">
        <h3
          className={`${
            solnStatus == "Accepted"
              ? "text-green-500 text-2xl"
              : "text-red-500 text-xl"
          }`}
        >
          {solnStatus}
        </h3>
        <div className="text-sm text-textdarkish">
          Runtime: {Math.floor(runTime * 1000)} ms
        </div>
      </div>

      <div className="flex gap-3 items-center pt-2">
        {expectedOpArr.length !== 0
          ? expectedOpArr.map((val, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded-lg cursor-pointer hover:bg-bordergrey flex gap-2 items-center ${
                  selectedTestCase == index
                    ? "bg-grey text-white"
                    : "text-textdarkish"
                }`}
                onClick={() => setSelectedTestcase(index)}
              >
                {statusArr[index] == "r" ? (
                  <div className="text-green-500">
                    <SquareCheck size={18} fill="green" />
                  </div>
                ) : (
                  <div className="text-red-500">
                    <SquareX
                      color="#c08282"
                      absoluteStrokeWidth
                      size={18}
                      fill="red"
                    />
                  </div>
                )}
                <div>case {index + 1}</div>
              </div>
            ))
          : null}
      </div>

      <div className="flex flex-col h-full w-full gap-2">
        {inputArr.length !== 0
          ? inputArr.map(
              (ele, index) =>
                selectedTestCase === index && (
                  <DisplayInputOutput testcase={ele} key={index} />
                )
            )
          : null}

        {expectedOpArr.map(
          (expectedOp, index) =>
            selectedTestCase === index && (
              <div key={index}>
                <DisplayOutputs
                  expectedOp={expectedOp}
                  userOp={codeOutput[index]}
                  status={statusArr[index]}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default DisplayAnswer;
