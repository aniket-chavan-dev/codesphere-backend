import React, { useEffect, useState } from "react";
import { CodeXml, Maximize, RotateCcw } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import dracula from "monaco-themes/themes/Dracula.json";
import CustonSelectTag from "./CustonSelectTag";
import { useSelector, useDispatch } from "react-redux";
import { setCodeGlobally } from "../../slices/usercodeSlice";

function FullScreenCodeEditor({ fullScreen, setFullScreen }) {
  const [selected, setSelected] = useState("python");
  const dispatch = useDispatch();
  const monaco = useMonaco();

  const { code, user } = useSelector((state) => state.code);

  const [localCode, setLocalCode] = useState(code.val);
  const { editorSetting } = useSelector((state) => state.editorSetting);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const obj = {
      lang: selected,
      val: localCode,
    };

    dispatch(setCodeGlobally({ obj, user }));
  }, [localCode]);

  useEffect(() => {
    if (editorSetting) {
      setFontSize(editorSetting.fontsize);
    }
  }, [editorSetting]);

  return (
    <div
      className={`${
        !fullScreen
          ? "hidden"
          : "block border-2 border-grey overflow-y-auto rounded-xl"
      }`}
    >
      {" "}
      {/* Header */}
      <div className="w-full h-9 bg-grey p-2 flex justify-between items-center">
        <button className="flex gap-1 items-center cursor-pointer">
          <CodeXml className="text-green-500" />
          <span>Code</span>
        </button>

        <button
          className="text-textdarkish cursor-pointer hidden md:block"
          onClick={() => setFullScreen((pre) => !pre)}
        >
          <Maximize size={20} />
        </button>
      </div>
      {/* Language selector */}
      <div className="w-full h-8 bg-problemdark p-2 flex justify-between items-center text-textdarkish">
        <CustonSelectTag selected={selected} setSelected={setSelected} />
        <RotateCcw size={18} />
      </div>
      {/* Monaco Editor */}
      <div className="bg-problemdark w-full h-full">
        <Editor
          height="90vh"
          language={selected.toLowerCase()}
          value={code.val}
          onChange={(val) => setLocalCode(val)}
          beforeMount={(monaco) =>
            monaco.editor.defineTheme("dracula", dracula)
          }
          onMount={(editor, monaco) => {
            monaco.editor.setTheme("dracula");
          }}
          options={{
            fontSize: fontSize,
            fontFamily: "Consolas, 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default FullScreenCodeEditor;
