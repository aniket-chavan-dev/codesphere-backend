import React from "react";

function PublicTestCases({ examplesArr }) {
  let inputArr = [];
  let outputArr = [];
  let explanationArr = [];

  examplesArr.map((ele) => {
    let splitWithOutput = ele.split("Output");
    let inputString = `${splitWithOutput[0]}`.slice(9);
    inputArr.push(inputString);

    let splitWithExplanation = splitWithOutput[1]?.split("Explanation") || [];
    outputArr.push(splitWithExplanation[0] || "");

    if (splitWithExplanation.length === 2) {
      explanationArr.push(splitWithExplanation[1]);
    } else {
      explanationArr.push("");
    }
  });

  return (
    <div className="w-full">
      {examplesArr.map((example, index) => (
        <div className="flex flex-col pt-4 justify-center w-full" key={index}>
          <p className="whitespace-pre-line font-semibold text-base">
            Example {index + 1}
          </p>

          <div className="bg-dark p-4 mt-2 rounded-lg break-words overflow-x-auto text-sm sm:text-base">
            <div className="pt-2">
              <span className="font-semibold">Input: </span>
              <span className="text-textdarkish break-words whitespace-pre-wrap">
                {inputArr[index]}
              </span>
            </div>

            <div className="pt-2">
              <span className="font-semibold">Output: </span>
              <span className="text-textdarkish break-words whitespace-pre-wrap">
                {outputArr[index]}
              </span>
            </div>

            {explanationArr[index]?.trim() && (
              <div className="pt-2">
                <span className="font-semibold">Explanation: </span>
                <span className="text-textdarkish break-words whitespace-pre-wrap">
                  {explanationArr[index]}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PublicTestCases;
