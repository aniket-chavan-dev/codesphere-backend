import React from "react";

function DisplayRunTimeerror({ solnStatus, error, testCases, codeOutput }) {
  let lastexecutedInput = [];

  if (codeOutput.length === 0) {
    for (const [key, val] of Object.entries(testCases[0].input)) {
      lastexecutedInput.push([key, val]);
    }
  } else {
    for (const [key, val] of Object.entries(
      testCases[codeOutput.length - 1].input
    )) {
      lastexecutedInput.push([key, val]);
    }
  }

  return (
    <div className="px-3 pt-2 flex flex-col w-full h-full gap-4">
      <h3
        className={`${
          solnStatus == "Accepted" ? "text-green-500" : "text-red-500 text-xl"
        }`}
      >
        {solnStatus}
      </h3>

      <div className="h-fullw-full bg-errorbackground">
        <div className="flex gap-2 p-3 text-red-600 whitespace-pre-line">
          {error}
        </div>
      </div>

      <p className="text-sm text-textdarkish">Last Executed Input</p>
      {lastexecutedInput.map(([key, val], index) => (
        <div
          className="bg-grey rounded-2xl p-3 flex flex-col gap-1"
          key={index}
        >
          <div>{key} = </div>
          <div>{typeof val === "object" ? "[" + val.join(",") + "]" : val}</div>
        </div>
      ))}
    </div>
  );
}

export default DisplayRunTimeerror;
