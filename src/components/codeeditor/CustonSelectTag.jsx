import { ChevronDown, Check } from "lucide-react";
import React from "react";
import { useState } from "react";
function CustonSelectTag({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const options = ["python"];

  return (
    <div className="relative w-64">
      <button
        onClick={() => setOpen(!open)}
        className="text-textdarkish  px-3 py-2  text-left flex justify-between items-center gap-3"
      >
        {selected}
        <span>
          <ChevronDown />
        </span>
      </button>

      {open && (
        <ul className="absolute w-full bg-grey border border-gray-700 mt-1 rounded-lg overflow-hidden z-10">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={`px-3 py-2 hover:bg-problemdark cursor-pointer `}
            >
              {selected === opt ? (
                <div className="flex gap-3 items-center">
                  <span>
                    <Check size={18} />
                  </span>
                  <span>{opt}</span>
                </div>
              ) : (
                opt
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustonSelectTag;
