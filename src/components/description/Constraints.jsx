import React from "react";

function Constraints({ constaintsArr }) {
  if (constaintsArr.length == 0) return null;

  const consString = constaintsArr[0];
  let splitWithNewLine = consString.split("\n");

  let conArr = [];
  for (let i = 1; i < splitWithNewLine.length; i++) {
    conArr.push(splitWithNewLine[i]);
  }
  return (
    <div className="pt-6">
      <h4>Cobstaints:</h4>

      {conArr.map((con, index) =>
        con !== "" ? (
          <p key={index} className="pt-5">
            • <span className="bg-grey text-textdarkish p-1">{con}</span>
          </p>
        ) : null
      )}
    </div>
  );
}

export default Constraints;
