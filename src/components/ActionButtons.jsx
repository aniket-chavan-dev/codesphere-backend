import React from "react";
import runPublicTestCases from "../utilities/runPublicTestCases";
import { Play, CloudUpload } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  setPublicTestCasesResult,
  setRunBtn,
} from "../slices/runPublicTestCasesResultSlice";

import {
  setSubLoading,
  setSubBtnCliked,
  setSubResult,
} from "../slices/submissions/submissionSlice";
function ActionButtons({ user }) {
  const { code } = useSelector((state) => state.code);
  const { problem, testcases, test_cases } = useSelector(
    (state) => state.testcases
  );
  const dispatch = useDispatch();

  const runCodeHandler = async () => {
    const url = "/code/run/";
    dispatch(setRunBtn(true));
    if (user && testcases) {
      dispatch(setLoading(true));
      const res = await runPublicTestCases(
        code.val,
        testcases,
        problem.id,
        url
      );
      dispatch(setLoading(false));

      dispatch(setPublicTestCasesResult(res));
    }
  };

  const submitBtnHandler = async () => {
    const url = "/submissions/submit/";
    dispatch(setSubBtnCliked(true));
    if (user && testcases) {
      dispatch(setSubLoading(true));

      const res = await runPublicTestCases(code, testcases, problem.id, url);
      const sub_reslut = {
        sub_data: res.sub_data,
        last_executed_input: res.last_executed_input,
      };
      dispatch(setSubLoading(false));
      dispatch(setSubResult(sub_reslut));
    }
  };

  return (
    <div className="hidden md:flex gap-2 ">
      <button
        className="rounded group p-2 hover:bg-grey border border-grey cursor-pointer"
        onClick={runCodeHandler}
        disabled={!user}
      >
        <Play />

        <p
          className={`${
            user
              ? "hidden"
              : "opacity-0 group-hover:opacity-100 absolute top-12 text-textdarkish bg-grey z-10  border-1 border-bordergrey rounded-2xl text-sm"
          } `}
        >
          You need to login sign in to run or submit code
        </p>
      </button>
      <button
        className="flex gap-2 items-center text-green-500 rounded border p-2 border-grey hover:bg-grey transition-all duration-75 cursor-pointer  group"
        onClick={submitBtnHandler}
        disabled={!user}
      >
        <CloudUpload />
        <span className="hidden md:block">Submit</span>

        <p
          className={`${
            user
              ? "hidden"
              : "opacity-0 group-hover:opacity-100 absolute top-12 text-textdarkish bg-grey z-10  border-1 border-bordergrey rounded-2xl text-sm"
          } `}
        >
          You need to login sign in to run or submit code
        </p>
      </button>
    </div>
  );
}

export default ActionButtons;
