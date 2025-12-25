import React, { useEffect } from "react";
import Problems from "./Problems";
import { useDispatch } from "react-redux";
import { resetSubmission } from "../slices/submissions/submissionSlice";
function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSubmission());
  }, []);
  return <Problems />;
}

export default Home;
