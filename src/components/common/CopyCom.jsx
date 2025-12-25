import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyCom({ text }) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div
      className="hidden group-hover:flex text-textdarkish  absolute top-3 right-2 gap-1 items-center bg-grey p-1 rounded cursor-pointer hover:bg-bordergrey transition-all duration-80"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1000);
        });
      }}
    >
      {isCopied ? (
        <div className="text-green-700">
          <Check size={18} />
        </div>
      ) : (
        <Copy size={18} />
      )}
    </div>
  );
}

export default CopyCom;
