import React from "react";
import { ArrowLeft } from "lucide-react";
function MoveToAllSubmissions({ setSelectedTab, setShowSubAnsTab }) {
  return (
    <div
      className="flex gap-3 items-center text-textdarkish cursor-pointer"
      onClick={() => {
        setSelectedTab("Submissions");
        setShowSubAnsTab(false);
        console.log("btn cliked");
      }}
    >
      <ArrowLeft />
      <div>All Submissions</div>
    </div>
  );
}

export default MoveToAllSubmissions;
