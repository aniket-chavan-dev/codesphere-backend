import React from "react";

function DisplayOutputs({ expectedOp, userOp, status }) {
  const expectedOp2 = expectedOp;

  let userOp2 = userOp.split("");
  if (typeof expectedOp == "object") {
    expectedOp =
      typeof expectedOp == "object"
        ? `[${expectedOp.join(", ")}]`
        : `${expectedOp}`;
    expectedOp = expectedOp.split("");
  } else {
    expectedOp = `${expectedOp}`;
    expectedOp = expectedOp.split("");
  }
  return (
    <div className=" h-full">
      <p className="text-textdarkish">Your Output = </p>
      <div className="bg-grey w-full rounded-xl p-2">
        {status == "r" ? (
          <p className="text-sm text-green-500">{userOp}</p>
        ) : expectedOp.length >= userOp2.length ? (
          expectedOp.map((val, index) =>
            userOp2.length > index ? (
              userOp2[index] != val ? (
                <span className="text-red-500" key={index}>
                  {userOp2[index]}
                </span>
              ) : (
                <span className="text-green-500" key={index}>
                  {userOp2[index]}
                </span>
              )
            ) : null
          )
        ) : expectedOp.length < userOp2.length ? (
          userOp2.map((val, index) =>
            expectedOp.length > index ? (
              expectedOp[index] != val ? (
                <span className="text-red-500" key={index}>
                  {val}
                </span>
              ) : (
                <span className="text-green-500" key={index}>
                  {val}
                </span>
              )
            ) : (
              <span className="text-red-500" key={index}>
                {val}
              </span>
            )
          )
        ) : null}
      </div>
      <p className="text-textdarkish text-sm">Expected Output = </p>
      <div className="bg-grey w-full rounded-xl p-2">
        <p className="text-green-500">
          {typeof expectedOp2 == "object"
            ? `[${expectedOp2}]`
            : `${expectedOp2}`}
        </p>
      </div>
    </div>
  );
}

export default DisplayOutputs;
