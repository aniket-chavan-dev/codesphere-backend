import React, { useEffect, useState } from "react";
import MoveToAllSubmissions from "./common/MoveToAllSubmissions";
import CopyCom from "../common/CopyCom";
import { Check, NotepadText } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import api from "../../utilities/api";
import { setTestCasesGlobally } from "../../slices/testcasesSlice";
import { useDispatch } from "react-redux";

function WrongAnswer({ result }) {
  const [selectedIndicator, setSelectedIndicater] = useState(0);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [isShowing, setIsShowing] = useState(false);

  const indicaters = ["blue", "red", "pink", "violet", "white", "yellow"];

  let inputArr = [];
  for (const [key, val] of Object.entries(
    result.sub_data.last_executed_input.input
  )) {
    inputArr.push([key, val]);
  }

  const updateNotes = async () => {
    setIsLoading(true);
    try {
      const res = await api.put(
        `submissions/submit/note/${result.sub_data.id}/`,
        { text: text, indicater: indicaters[selectedIndicator] }
      );
      const data = await res.data;
      console.log(data);
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

  return (
    <div className="w-full h-full p-4 flex flex-col overflow-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-red-500 text-xl">Wrong Answer</h3>
        <div className="text-sm text-textdarkish">
          {result.sub_data.passed_test_cases}/{result.sub_data.total_test_cases}{" "}
          test cases passed
        </div>
      </div>

      <div className="text-sm text-textdarkish flex justify-between items-center pt-3">
        <div>Last Executed Input</div>
        <div
          className="flex gap-1 items-center hover:bg-bordergrey p-1 cursor-pointer rounded-lg"
          onClick={() => {
            dispatch(
              setTestCasesGlobally(result.sub_data.last_executed_input.input)
            );
          }}
        >
          <div>
            <NotepadText size={18} />
          </div>
          <div>Use Testcase</div>
        </div>
      </div>

      {/* display last executed input */}

      <div className="pt-2 flex flex-col gap-2">
        <div className="text-sm text-textdarkish">input</div>
        {inputArr.map((input, index) => (
          <div className="bg-grey p-3 rounded-lg group relative" key={index}>
            <div>
              <div className="text-textdarkish">{input[0]} =</div>
              <div>
                {typeof input[1] == "object" ? `[${input[1]}]` : input[1]}
              </div>
            </div>
            <div>
              <CopyCom
                text={typeof input[1] == "object" ? `[${input[1]}]` : input[1]}
              />
            </div>
          </div>
        ))}

        <div className="text-textdarkish">output</div>

        <div className="bg-grey p-3 rounded-lg group relative">
          <div>
            <div>{result.sub_data.user_output}</div>
          </div>
          <div>
            <CopyCom text={result.sub_data.user_output} />
          </div>
        </div>

        <div className="text-textdarkish">expected output</div>

        <div className="bg-dark p-3 rounded-lg group relative">
          <div>
            <div className="text-green-600">
              {typeof result.sub_data.last_executed_input.expected_output ==
              "object"
                ? `[${result.sub_data.last_executed_input.expected_output}]`
                : result.sub_data.last_executed_input.expected_output}
            </div>
          </div>
          <div>
            <CopyCom text={result.sub_data.user_output} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center text-sm text-textdarkish pt-2">
        <div className="border-r-2 border-bordergrey pr-2">Code</div>
        <div>{result.sub_data.lang}</div>
      </div>

      {/* code */}

      <div className="pt-2 group relative w-full   rounded-lg">
        <SyntaxHighlighter language={result.sub_data.lang} style={oneDark}>
          {result.sub_data.code}
        </SyntaxHighlighter>
        <CopyCom text={result.sub_data.code} />
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

export default WrongAnswer;
