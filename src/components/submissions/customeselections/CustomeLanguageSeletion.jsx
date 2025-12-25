import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

function CustomeLanguageSeletion({ selectedLanguage, setSelectedLanguage }) {
  const [open, setOpen] = useState(false);
  const options = ["All", "python"];
  return (
    <div className=" relative">
      <button
        className="flex items-center gap-2 cursor-pointer flex-wrap"
        onClick={() => setOpen((pre) => !pre)}
      >
        <span> {selectedLanguage}</span>
        <span>
          {" "}
          <ChevronDown />
        </span>
      </button>

      {open && (
        <ul className="absolute w-50 z-10  bg-grey flex flex-col  text-sm text-textdarkish p-2">
          {options.map((opt) =>
            selectedLanguage == opt ? (
              <li
                key={opt}
                className="flex gap-2 border-b-1 border-bordergrey p-2 hover:bg-bordergrey cursor-pointer items-center justify-between text-white"
              >
                {opt}
                <Check className="text-blue-500" />
              </li>
            ) : (
              <li
                key={opt}
                className="flex gap-2 border-b-1 border-bordergrey p-2 hover:bg-bordergrey cursor-pointer"
                onClick={() => setSelectedLanguage(opt)}
              >
                {opt}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default CustomeLanguageSeletion;
