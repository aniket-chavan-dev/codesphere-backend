import React, { useEffect, useState } from "react";
import { useEffectEvent } from "react";
import { useSelector } from "react-redux";
import DisplayInputOutput from "./DisplayInputOutput";
import { getInputArr } from "../../utilities/helper";

function DisplayTestCases() {
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [publicTestCases, setPublicTestCases] = useState([]);

  const { problem, testcases, test_cases } = useSelector(
    (state) => state.testcases
  );

  useEffect(() => {
    if (testcases) {
      setPublicTestCases(getInputArr(test_cases));
    }
  }, [testcases]);

  return (
    <div className="bg-problemdark p-6 rounded-bl-2xl">
      <div className="flex gap-3 items-center">
        {publicTestCases.length !== 0
          ? publicTestCases.map((testcase, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded-lg cursor-pointer hover:bg-bordergrey ${
                  selectedTestCase == index
                    ? "bg-grey text-white"
                    : "text-textdarkish"
                }`}
                onClick={() => setSelectedTestCase(index)}
              >
                Case {index + 1}
              </div>
            ))
          : null}
      </div>
      <div className="flex flex-col gap-2">
        {publicTestCases.length !== 0
          ? publicTestCases.map(
              (ele, index) =>
                selectedTestCase === index && (
                  <DisplayInputOutput testcase={ele} key={index} />
                )
            )
          : null}
      </div>
    </div>
  );
}

export default DisplayTestCases;
