import React, { useEffect, useState } from "react";
import CustomeStatusSelect from "./customeselections/CustomeStatusSelect";
import CustomeLanguageSeletion from "./customeselections/CustomeLanguageSeletion";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utilities/api";
import SubLoader from "./customeselections/SubLoader";
import { X } from "lucide-react";
import {
  setSubBtnCliked,
  setSubResult,
  setSubLoading,
  resetSubmission,
} from "../../slices/submissions/submissionSlice";

function Submissions({ problem }) {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoteUpdate, setShowNoteUpadte] = useState(false);
  const [filterSubmissions, setFilterSubmissions] = useState([]);
  const [selectedIndicater, setSelectedIndicater] = useState("blue");
  const [text, setText] = useState("");
  const [subId, setSubId] = useState(null);
  const [noteUpdateIndex, setNoteUpdateIndex] = useState(null);

  const indicators = ["pink", "green", "blue", "red", "yellow", "white"];

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="flex items-center h-full p-4">
        <p className="text-sm text-textdarkish">
          You need to login first to see your all submissions of this problem
        </p>
      </div>
    );
  }

  const fetchedProblems = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("submissions/listofsubmissions/" + problem.id);
      const data = res.data;
      setSubmissions(res.data);
      setFilterSubmissions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchedProblems();
    }
  }, []);

  useEffect(() => {
    if (selectedStatus == "All") {
      setFilterSubmissions(submissions);
      return;
    }
    const tempData = submissions;
    const filData = tempData.filter((data) => data.status == selectedStatus);
    setFilterSubmissions(filData);
  }, [selectedStatus]);

  if (isLoading) return <SubLoader />;

  const formatedDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short", // "Oct"
      day: "numeric",
      hour12: false, // 24-hour format
    };

    return date.toLocaleString("en-US", options);
  };

  const notesHandler = async (id, index) => {
    setShowNoteUpadte(true);
    setSubId(id);
    setNoteUpdateIndex(index);
  };

  const updateHandler = async () => {
    try {
      const res = await api.put(`submissions/submit/note/${subId}/`, {
        text,
        indicater: selectedIndicater,
      });
      const data = res.data;
      setFilterSubmissions((pre) => {
        const tempArr = [...pre];
        tempArr[noteUpdateIndex] = data.sub_data;
        return tempArr;
      });
    } catch (error) {
      console.log("error while updating note", error);
    }
  };

  const retriveSubmission = async (id) => {
    dispatch(setSubBtnCliked(true));
    if (user) {
      dispatch(setSubLoading(true));
      try {
        const res = await api.get("submissions/submission/" + id);
        const data = res.data;
        dispatch(setSubResult(data));
      } catch (error) {
        console.log("error occured during feched submission", error);
      } finally {
        dispatch(setSubLoading(false));
      }
    }
  };

  return (
    <div className="w-full p-2 text-textdarkish relative">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3 ">
        <div className="p-1 cursor-pointer hover:bg-bordergrey rounded-lg">
          <CustomeStatusSelect
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
        <div className="p-1 cursor-pointer hover:bg-bordergrey rounded-lg">
          <CustomeLanguageSeletion
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-bordergrey text-sm rounded-lg overflow-hidden">
          <thead className="bg-bordergrey text-left text-textdarkish uppercase">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Language</th>
              <th className="px-4 py-2">Runtime</th>
              <th className="px-4 py-2">Memory</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>

          <tbody className="cursor-pointer">
            {filterSubmissions.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-bordergrey hover:bg-bordergrey/40 transition group"
                onClick={() => retriveSubmission(item.id)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td
                  className={`px-4 py-2 ${
                    item.status == "Accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                  <span className="text-sm text-textdarkish block">
                    {formatedDate(item.created_at)}
                  </span>
                </td>
                <td className="px-4 py-2">{item.lang}</td>
                <td className="px-4 py-2">
                  {(item.execution_time * 1000).toFixed(2)}
                </td>
                <td className="px-4 py-2">{item.memory_use}</td>
                {item.note == "" ? (
                  <td className="px-4 py-2">
                    <span
                      className="items-center hidden group-hover:flex group-hover:gap-2 p-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        notesHandler(item.id, index);
                      }}
                    >
                      <span className="text-lg text-blue-500">+</span>
                      <span className="text-sm text-blue-500">Notes</span>
                    </span>
                  </td>
                ) : (
                  <td
                    className="px-4 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      notesHandler(item.id, index);
                    }}
                  >
                    {item.note}{" "}
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ backgroundColor: item.sub_indicater }}
                    ></span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!submissions.length && (
        <div className="text-centre h-full w-full  mx-auto absolute left-60 top-50">
          No Submissions yet
        </div>
      )}

      {showNoteUpdate && (
        <div className="absolute w-[70%] left-1/2 top-80 -translate-x-1/2 -translate-y-1/2 bottom-1/2 bg-problemdark h-80">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-white">Notes</div>
              <div
                className="p-1 hover:bg-bordergrey cursor-pointer rounded-lg"
                onClick={() => setShowNoteUpadte(false)}
              >
                <X />
              </div>
            </div>

            <div className="p-2">
              <textarea
                className="w-full h-40 outline-none focus:ring-1 focus:ring-blue-500 bg-grey text-white p-3"
                placeholder="write your notes here"
                onChange={(e) => setText(e.target.value)}
                value={text}
              ></textarea>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 px-2">
                {indicators.map((color) => (
                  <div
                    className={`w-5 h-5 rounded-full border-1 cursor-pointer`}
                    key={color}
                    style={{
                      borderColor: color,
                      backgroundColor: `${
                        selectedIndicater == color ? color : ""
                      }`,
                    }}
                    onClick={() => setSelectedIndicater(color)}
                  ></div>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <button
                  className="p-1 cursor-pointer bg-grey rounded-lg"
                  onClick={() => {
                    setShowNoteUpadte(false);
                    setText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-1 bg-gray-200 rounded text-dark cursor-pointer "
                  onClick={() => {
                    updateHandler();
                    setShowNoteUpadte(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submissions;
