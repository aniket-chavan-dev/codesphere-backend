import React from "react";

function DisplayInputOutput({ testcase }) {
  const newTestCases = testcase.map((input) => {
    let arr = input[1];
    if (Array.isArray(arr)) {
      arr = arr.map((val) => (val === null ? "null" : val));
    }
    input[1] = arr;
    return input;
  });

  return newTestCases.map((input, index) => (
    <div className=" h-full" key={index}>
      <p className="text-textdarkish">{input[0]} = </p>
      <div className="bg-grey w-full rounded-xl p-2">
        {typeof input[1] === "object"
          ? `[${input[1].join(", ")}]`
          : `${input[1]}`}
      </div>
    </div>
  ));
}

export default DisplayInputOutput;
