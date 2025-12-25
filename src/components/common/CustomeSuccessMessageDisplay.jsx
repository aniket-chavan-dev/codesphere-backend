import { Check, SquareCheck } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetSuccessMesager } from "../../slices/successMessageDisplaySlice";

function CustomeSuccessMessageDisplay({ content }) {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetSuccessMesager());
    }, 2000);
  }, []);

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-99 bg-black p-2 rounded-lg">
      <div className="flex gap-2 items-center">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={16} />
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}

export default CustomeSuccessMessageDisplay;
