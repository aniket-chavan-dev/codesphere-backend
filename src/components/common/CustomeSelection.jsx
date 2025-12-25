import React, { useState } from "react";
import { ArrowDownWideNarrow } from "lucide-react";

function CustomeSelection({ selectedOption, options, setSelectedOption }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative ">
      <div
        className="flex gap-2 items-center cursor-pointer p-2 hover:bg-bordergrey rounded-lg text-textdarkish"
        onClick={() => setIsOpen((pre) => !pre)}
      >
        <ArrowDownWideNarrow />
        <div>{selectedOption}</div>
      </div>

      {isOpen && (
        <ul className="w-30 bg-grey absolute h-30 z-10 overflow-auto flex flex-col p-2 rounded-lg text-textdarkish">
          {options.map((option, index) => (
            <li
              key={option}
              className="p-1 border-b-1 flex  border-bordergrey hover:bg-bordergrey cursor-pointer rounded-lg"
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomeSelection;
