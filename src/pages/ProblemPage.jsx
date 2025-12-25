import { Tag, ThumbsUp, ThumbsDown, MessageCircle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemNavBar from "../components/ProblemNavBar";
import { NotepadText, FlaskConical, History } from "lucide-react";
import Description from "../components/description/Description";
import Solutions from "../components/solutions/Solutions";
import Submissions from "../components/submissions/Submissions";
import api from "../utilities/api";
import Split from "react-split";
import RightPanel from "../components/RightPanel";
import "../components/css/MainPanel.css";
import FullScreenCodeEditor from "../components/codeeditor/FullScreenCodeEditor";
import { setProblemGlobally } from "../slices/testcasesSlice";
import { useDispatch, useSelector } from "react-redux";
import EditorSetting from "../components/EditorSetting";
import { setReset } from "../slices/runPublicTestCasesResultSlice";
import { setCodeGlobally, resetCode } from "../slices/usercodeSlice";

import SubAnswer from "../components/submissionans/SubAnswer";

import CustomeSuccessMessageDisplay from "../components/common/CustomeSuccessMessageDisplay";

function ProblemPage() {
  let { title } = useParams();
  title = title.replace("---", "--");
  title = title.split("-").join(" ");
  title = title.replace("  ", " - ");

  const [selectedTab, setSelectedTab] = useState("Description");
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [code, setCode] = useState(null);
  const [showSubAnsTab, setShowSubAnsTab] = useState(false);
  const [tabsArr, setTabsArr] = useState([
    "Description",
    "Solutions",
    "Submissions",
  ]);

  const firstRender = useRef(true);
  const leftPanelDiv = useRef(null);

  const user = useSelector((state) => state.user);
  const submissionsAttributed = useSelector((state) => state.submissions);
  const successMesagerAttr = useSelector((state) => state.successMesager);

  const dispatch = useDispatch();

  const fetchProblem = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`problems/problem/${title}`);
      setProblem(res.data.data);
      dispatch(setProblemGlobally(res.data.data));
      console.log(res.data.data.description, res.data.data.id);
      setCode(res.data.code);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
    dispatch(setReset());
    if (code != "") {
      const obj = {
        val: code,
        lang: "python",
      };
      dispatch(setCodeGlobally({ obj, user }));
    } else {
      dispatch(resetCode());
    }
  }, [title, code]);

  useEffect(() => {
    if (
      submissionsAttributed.loading &&
      submissionsAttributed.isSubmitBtnClicked
    ) {
      setSelectedTab("loading");
    }
    if (submissionsAttributed.isSubmitBtnClicked) {
      setShowSubAnsTab(true);
    }
    if (
      !submissionsAttributed.loading &&
      submissionsAttributed.isSubmitBtnClicked
    ) {
      setSelectedTab(
        `${
          submissionsAttributed.result &&
          submissionsAttributed.result.sub_data.status
        }`
      );
    }
  }, [submissionsAttributed]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!showSubAnsTab) {
      setSelectedTab("Submissions");
    } else {
      setSelectedTab(
        `${
          submissionsAttributed.result &&
          submissionsAttributed.result.sub_data.status
        }`
      );
    }
  }, [showSubAnsTab]);

  return (
    <div
      className={`${
        openSetting
          ? "bg-black/10"
          : "text-white min-h-screen md:h-screen flex flex-col overflow-y-auto  md:overflow-hidden relative"
      }`}
    >
      {/* Navbar */}
      <ProblemNavBar setOpenSetting={setOpenSetting} />

      {successMesagerAttr?.notifyTodisplayMessage && (
        <CustomeSuccessMessageDisplay content={successMesagerAttr?.message} />
      )}

      {/* Fullscreen Code Editor */}
      <FullScreenCodeEditor
        setFullScreen={setFullScreen}
        fullScreen={fullScreen}
      />

      {/* Settings Drawer */}
      <EditorSetting
        openSetting={openSetting}
        setOpenSetting={setOpenSetting}
      />

      {/* Split Panels */}
      <Split
        className={`split px-4 flex-1 overflow-hidden ${
          fullScreen ? "hidden" : ""
        }`}
        minSize={400}
        direction="horizontal"
      >
        {/* LEFT PANEL */}
        <div
          className={`border-2 border-grey rounded-xl bg-problemdark flex flex-col h-full md:overflow-hidden`}
        >
          {/* 🔝 Tabs (Fixed, Responsive) */}
          <div className="flex gap-2 px-2 bg-grey h-auto min-h-[40px] items-center shrink-0 overflow-x-auto scrollbar-hide">
            {tabsArr.map((tab, i) => {
              const icons = [NotepadText, FlaskConical, History];
              const Icon = icons[i];
              return (
                <button
                  key={i}
                  className={`flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-md whitespace-nowrap transition-all duration-100 text-xs sm:text-sm md:text-base cursor-pointer ${
                    selectedTab === tab
                      ? "text-white border-b-2 border-blue-500"
                      : "text-textdarkish hover:text-white"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  <Icon size={16} className="text-blue-500 shrink-0" />
                  <span>{tab}</span>
                </button>
              );
            })}

            {showSubAnsTab ? (
              submissionsAttributed && submissionsAttributed.loading ? (
                <button className="animate-pulse bg-gray-600 h-5 w-20 rounded-xl"></button>
              ) : (
                <button
                  className={`flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-md whitespace-nowrap transition-all duration-100 text-xs sm:text-sm md:text-base cursor-pointer ${
                    selectedTab === submissionsAttributed.result.sub_data.status
                      ? "text-white border-b-2 border-blue-500"
                      : "text-textdarkish hover:text-white"
                  }`}
                  onClick={() =>
                    setSelectedTab(
                      `${
                        submissionsAttributed.result.sub_data &&
                        submissionsAttributed.result.sub_data.status
                      }`
                    )
                  }
                >
                  <History size={16} className="text-blue-500 shrink-0" />
                  <span
                    className={`${
                      submissionsAttributed.result &&
                      submissionsAttributed.result.sub_data.status == "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submissionsAttributed.result &&
                      submissionsAttributed.result.sub_data.status}
                  </span>
                  <span
                    onClick={() => {
                      setShowSubAnsTab(false);
                    }}
                  >
                    <X size={18} />
                  </span>
                </button>
              )
            ) : null}
          </div>

          {/* 🧾 Scrollable Middle Section */}
          <div
            className="flex-1 overflow-visible md:overflow-y-auto custom-scroll"
            ref={leftPanelDiv}
          >
            {selectedTab === "Description" && (
              <Description isLoading={isLoading} problem={problem} />
            )}
            {selectedTab === "Solutions" && (
              <Solutions problem={problem} leftPanelDiv={leftPanelDiv} />
            )}
            {selectedTab === "Submissions" && <Submissions problem={problem} />}
            {(selectedTab ===
              `${
                submissionsAttributed.result &&
                submissionsAttributed.result.sub_data.status
              }` ||
              selectedTab === "loading") && (
              <SubAnswer
                submissionsAttributed={submissionsAttributed}
                setSelectedTab={setSelectedTab}
                setShowSubAnsTab={setShowSubAnsTab}
              />
            )}
          </div>

          {/* 👍 Bottom Fixed Section */}
          <div className="flex justify-between h-[40px] items-center px-4 py-2 bg-grey border-t border-bordergrey md:shrink-0">
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 p-2 bg-grey items-center rounded-4xl cursor-pointer hover:opacity-50">
                <ThumbsUp size={15} /> {problem && problem.likes_count}
              </div>
              <div className="p-2 bg-grey items-center rounded-4xl cursor-pointer hover:opacity-50">
                <ThumbsDown size={15} />
              </div>
              <div className="flex gap-2 items-center p-2 bg-grey rounded-4xl cursor-pointer hover:opacity-50">
                <MessageCircle size={15} /> {problem && problem.discuss_count}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <RightPanel fullScreen={fullScreen} setFullScreen={setFullScreen} />
      </Split>
    </div>
  );
}

export default ProblemPage;
