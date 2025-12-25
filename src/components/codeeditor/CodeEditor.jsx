import React, { useState, useRef, useEffect } from "react";
import { CodeXml, Maximize, RotateCcw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";
import CustonSelectTag from "./CustonSelectTag";
import CodeSample from "./CodeSample";
import api from "../../utilities/api";
import {
  setCodeGlobally,
  setCodeValGlobally,
} from "../../slices/usercodeSlice";
import { setLoading } from "../../slices/submissions/timememoryqueryforcode";

// import monaco themes
import dracula from "monaco-themes/themes/Dracula.json";
import monokai from "monaco-themes/themes/Monokai.json";
import brilliance from "monaco-themes/themes/Brilliance Black.json";
import cobalt from "monaco-themes/themes/Cobalt.json";
import solarized from "monaco-themes/themes/Solarized-dark.json";
import nord from "monaco-themes/themes/Night Owl.json";
import CustomeSelection from "../common/CustomeSelection";
import tomorrow from "monaco-themes/themes/Tomorrow-Night-Bright.json";

function CodeEditor({ fullScreen, setFullScreen }) {
  const [selected, setSelected] = useState("python");
  const [localCode, setLocalCode] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("monokai"); // 🌙 default Monokai
  const editorRef = useRef(null);
  const dispatch = useDispatch();

  const { problem, testcases } = useSelector((state) => state.testcases);
  const { code } = useSelector((state) => state.code);
  const { editorSetting } = useSelector((state) => state.editorSetting);
  const user = useSelector((state) => state.user);
  const timememoryQueryAttr = useSelector((state) => state.timeMemQuery);

  const [fontSize, setFontSize] = useState(14);
  const [selectedTab, setSelectedTab] = useState("code");
  const [isShowCodeSampleTab, setIsCodeSampleTab] = useState(false);
  const [timeMemoryData, setTimeMemoryData] = useState({});
  const [isChangeCode, setIsChangeCode] = useState(false);

  const themeOptions = [
    "monokai",
    "brilliance",
    "cobalt",
    "dracula",
    "solarized",
    "nord",
    "tomorrow",
  ];

  // 🎨 Theme map
  const themeMap = {
    dracula,
    monokai,
    brilliance,
    cobalt,
    solarized,
    nord,
    tomorrow,
  };

  // 🧩 Fetch code samples
  const fetchedCodeSamples = async (range, query) => {
    try {
      const res = await api.get(
        `submissions/timememoryqery/?range=${range}&query=${query}&problem_id=${problem.id}`
      );
      const data = res.data;
      setTimeMemoryData({
        data: data.data,
        query: data.query,
      });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🧠 Load default code
  useEffect(() => {
    if (code.val !== "") {
      setLocalCode(code.val);
    } else if (problem && testcases) {
      const title = problem.title;
      const parameterArr = testcases?.parameters || [];
      let function_name = testcases?.function_name;
      let text = "";

      if (testcases?.is_linkedList) {
        text += `# Definition for linked list\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\n`;
      }

      if (testcases?.is_tree) {
        text += `# Definition for tree\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\n`;
      }

      text += `class Solution:\n    def ${function_name}(self,${parameterArr.join(
        ", "
      )}):\n        # write your code here\n        `;
      setLocalCode(text);
    }
  }, [problem, testcases, isChangeCode]);

  // 🔄 Sync global code
  useEffect(() => {
    const obj = { val: localCode, lang: selected };
    dispatch(setCodeGlobally({ obj, user }));
  }, [selected, fullScreen, localCode]);

  // 👇 Dynamic font size
  useEffect(() => {
    if (editorSetting) setFontSize(editorSetting.fontsize);
  }, [editorSetting]);

  // 🎨 Update theme dynamically
  useEffect(() => {
    if (editorRef.current) {
      const monacoInstance = editorRef.current._monaco;
      if (monacoInstance) {
        monacoInstance.editor.setTheme(selectedTheme);
      }
    }
  }, [selectedTheme]);

  return (
    <div
      className={`${
        fullScreen
          ? "hidden"
          : "flex flex-col border-2 border-grey rounded-xl h-full min-h-0 relative"
      }`}
    >
      {/* Header */}
      <div className="w-full h-9 bg-grey p-2 hidden md:flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            className="flex gap-1 items-center cursor-pointer hover:bg-bordergrey p-2 rounded-lg"
            onClick={() => setSelectedTab("code")}
          >
            <CodeXml className="text-green-500" />
            <span>Code</span>
          </button>

          <CustomeSelection
            options={themeOptions}
            selectedOption={selectedTheme}
            setSelectedOption={setSelectedTheme}
          />
        </div>

        <button
          className="text-textdarkish cursor-pointer hidden md:block"
          onClick={() => setFullScreen((pre) => !pre)}
        >
          <Maximize size={20} />
        </button>
      </div>

      {/* Monaco Editor */}
      {selectedTab === "code" && (
        <div className="flex flex-col h-full">
          <div className="w-full h-8 bg-problemdark p-2 flex justify-between items-center text-textdarkish">
            <CustonSelectTag selected={selected} setSelected={setSelected} />
            <RotateCcw
              size={18}
              onClick={() => {
                dispatch(setCodeValGlobally(""));
                setIsChangeCode((pre) => !pre);
              }}
              className="cursor-pointer"
            />
          </div>

          <div className="flex-1 bg-problemdark min-h-0">
            <Editor
              height="90%"
              language={selected.toLowerCase()}
              value={localCode}
              beforeMount={(monaco) => {
                Object.entries(themeMap).forEach(([key, themeData]) => {
                  monaco.editor.defineTheme(key, themeData);
                });
              }}
              onMount={(editor, monaco) => {
                monaco.editor.setTheme(selectedTheme);
                editorRef.current = editor;
                editorRef.current._monaco = monaco; // store reference
              }}
              onChange={(value) => setLocalCode(value)}
              options={{
                fontSize: fontSize,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      )}

      {selectedTab === "code sample" && (
        <CodeSample
          data={timeMemoryData}
          loading={timememoryQueryAttr.isLoading}
        />
      )}
    </div>
  );
}

export default CodeEditor;
