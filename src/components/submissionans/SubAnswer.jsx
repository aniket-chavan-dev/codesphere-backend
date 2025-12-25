import React from "react";
import SubAnsLoader from "./SubAnsLoader";
import RunTimeError from "../submissions/RunTimeError";
import MoveToAllSubmissions from "../submissions/common/MoveToAllSubmissions";
import WrongAnswer from "../submissions/WrongAnswer";
import Accepted from "../submissions/Accepted";

function SubAnswer({
  submissionsAttributed,
  setSelectedTab,
  setShowSubAnsTab,
}) {
  const { result, loading, isSubmitBtnClicked } = submissionsAttributed;

  if (loading) return <SubAnsLoader />;
  return (
    <div className="w-full flex flex-col justify-start p-2 md:p-4 bg-problemdark">
      <MoveToAllSubmissions
        setSelectedTab={setSelectedTab}
        setShowSubAnsTab={setShowSubAnsTab}
      />
      {result && result.sub_data.status === "Runtime Error" ? (
        <RunTimeError
          result={result}
          setSelectedTab={setSelectedTab}
          setShowSubAnsTab={setShowSubAnsTab}
        />
      ) : null}

      {result && result.sub_data.status === "Wrong Answer" ? (
        <WrongAnswer
          result={result}
          setSelectedTab={setSelectedTab}
          setShowSubAnsTab={setShowSubAnsTab}
        />
      ) : null}

      {result && result.sub_data.status === "Accepted" ? (
        <Accepted submissionsAttributed={submissionsAttributed} />
      ) : null}
    </div>
  );
}

export default SubAnswer;
