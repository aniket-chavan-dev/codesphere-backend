import { X, ChevronDown, Check, Slice } from "lucide-react";
import React, { useEffect, useState } from "react";
import { setEditorSettingGlobally } from "../slices/editorSettingSlice";
import { useDispatch } from "react-redux";

function EditorSetting({ openSetting, setOpenSetting }) {
  const [selectedFont, setSelectedFont] = useState(14);
  const [selectedTabSize, setSelectedTabSize] = useState(4);
  const [wordWrap, setWordWrap] = useState(false);
  const [relativeLineNumber, setLineNumber] = useState(false);
  const dispatch = useDispatch();

  const fontOptions = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  const tabOptions = [2, 4];
  const [showFontOptionMenu, setFontOptionMenu] = useState(false);
  const [showTabsOptions, setTabsOptions] = useState(false);

  useEffect(() => {
    dispatch(
      setEditorSettingGlobally({
        fontsize: selectedFont,
        tabSize: selectedTabSize,
        wordWrap,
        lineNumber: relativeLineNumber,
      })
    );
  }, [selectedFont, selectedTabSize, wordWrap, relativeLineNumber]);

  return (
    <div
      className={`${
        openSetting
          ? "fixed inset-0  bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          : "hidden"
      }`}
      onClick={() => setOpenSetting(false)}
    >
      <div
        className="bg-settingeditorbg  flex flex-col gap-3  text-white p-6 rounded-2xl w-[450px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex  justify-end text-white">
          <button
            onClick={() => {
              setOpenSetting(false);
            }}
            className="cursor-pointer hover:scale-120 hover:text-red-600 transition-all duration-70"
          >
            <X />
          </button>
        </div>

        <h3 className="text-white text-center p-0">Code Editor Settings</h3>

        <div className="px-15 pt-3 text-textgreyish">
          <div className="flex justify-between items-center">
            <p className="text-sm ">Font Size</p>
            <div className="relative">
              <button
                className="flex gap-2 p-1 cursor-pointer rounded-lg bg-buttongreybg items-center hover:bg-settingeditorbg"
                onClick={() => setFontOptionMenu((pre) => !pre)}
              >
                <span>{selectedFont} px</span>
                <ChevronDown size={22} />
              </button>

              {showFontOptionMenu && (
                <ul className="absolute w-full bg-grey border border-gray-700 mt-1 rounded-lg overflow-y-auto h-45 z-10">
                  {fontOptions.map((opt) => (
                    <li
                      key={opt}
                      onClick={() => {
                        setSelectedFont(opt);
                        setFontOptionMenu(false);
                      }}
                      className={`px-3 py-2 hover:bg-problemdark cursor-pointer `}
                    >
                      {selectedFont === opt ? (
                        <div className="flex gap-1 items-center">
                          <span>
                            <Check size={18} />
                          </span>
                          <span>{opt}</span>
                        </div>
                      ) : (
                        <span>{opt} px</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="px-15 pt-3 text-textgreyish">
          <div className="flex justify-between items-center">
            <p className="text-sm ">Tab Size</p>
            <div className="relative">
              <button
                className="flex gap-2 p-1 cursor-pointer rounded-lg bg-buttongreybg items-center hover:bg-settingeditorbg"
                onClick={() => setTabsOptions((pre) => !pre)}
              >
                <span>{selectedTabSize} spaces </span>
                <ChevronDown size={22} />
              </button>

              {showTabsOptions && (
                <ul className="absolute w-30 bg-grey border border-gray-700 mt-1 rounded-lg overflow-y-auto h-45 z-10">
                  {tabOptions.map((opt) => (
                    <li
                      key={opt}
                      onClick={() => {
                        setSelectedTabSize(opt);
                        setTabsOptions(false);
                      }}
                      className={`px-3 py-2 hover:bg-problemdark cursor-pointer `}
                    >
                      {selectedTabSize === opt ? (
                        <div className="flex gap-1 items-center">
                          <span>
                            <Check size={18} />
                          </span>
                          <span>{opt} spaces</span>
                        </div>
                      ) : (
                        <span>{opt} spaces</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-15 text-textgreyish pt-3">
          <p>Word Wrap</p>
          <div
            onClick={() => setWordWrap((pre) => !pre)}
            className={`w-9 h-3 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              wordWrap ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                wordWrap ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between px-13 text-textgreyish pt-3">
          <p>Relative Line Number</p>
          <div
            onClick={() => setLineNumber((pre) => !pre)}
            className={`w-9 h-3 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              relativeLineNumber ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                relativeLineNumber ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorSetting;
