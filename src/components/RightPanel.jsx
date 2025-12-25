import React from "react";
import Split from "react-split";
import "../components/css/RightPanel.css";
import CodeEditor from "./codeeditor/CodeEditor";
import TestCases from "./testcases/TestCases";

function RightPanel({ fullScreen, setFullScreen }) {
  return (
    <Split
      className={`${fullScreen ? "hidden" : "md:h-[calc(100vh-50px)]"}`}
      direction="vertical"
      sizes={[60, 40]}
      minSize={80}
      gutterSize={6}
    >
      <div className="min-h-0 h-full pb-2">
        <CodeEditor fullScreen={fullScreen} setFullScreen={setFullScreen} />
      </div>

      <TestCases />
    </Split>
  );
}

export default RightPanel;
