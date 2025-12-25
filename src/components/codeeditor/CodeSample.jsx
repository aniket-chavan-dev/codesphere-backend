import React, { useState } from "react";
import Loader from "./Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyCom from "../common/CopyCom";

function CodeSample({ data, loading }) {
  console.log(data);

  const [index, setIndex] = useState(0);

  if (!data.data) return <h1 className="text-center">No Code Samples Found</h1>;
  const sizeData = data.data.length;

  if (!sizeData) return <h1 className="text-center">No Code Samples Found</h1>;

  const selectedData = index < sizeData && data.data[index];

  if (loading) return <Loader />;

  return (
    <div className="p-4 bg-problemdark h-full flex flex-col gap-2">
      <div className="flex justify-between items-center h-6">
        <div>
          {data.query == "runtime" ? "Runtime" : "Memory"}:{" "}
          {selectedData.runtime?.toFixed(2)}
        </div>
        <div>
          <button
            className={`p-2 rounded-lg text-textdarkish  cursor-pointer ${
              index < 1 ? "bg-problemdar" : "hover:bg-bordergrey "
            }`}
            disabled={index < 1}
            onClick={() => setIndex((pre) => pre - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            className={`p-2 rounded-lg text-textdarkish  cursor-pointer ${
              index >= sizeData - 1 ? "bg-problemdar" : "hover:bg-bordergrey "
            }`}
            disabled={index >= sizeData - 1}
            onClick={() => setIndex((pre) => pre + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="group relative w-full h-full overflow-auto  rounded-lg">
        <SyntaxHighlighter language={"python"} style={oneDark}>
          {selectedData.code}
        </SyntaxHighlighter>
        <CopyCom text={selectedData.code} />
      </div>
    </div>
  );
}

export default CodeSample;
