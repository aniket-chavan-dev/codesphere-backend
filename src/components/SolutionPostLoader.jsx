import React from "react";

function SolutionPostLoader() {
  return (
    <div className="flex items-center justify-center h-full bg-[#0d0d0f]">
      <div className="relative flex gap-3 w-24 h-8">
        <span className="loader-circle bg-blue-500"></span>
        <span className="loader-circle bg-green-500"></span>
        <span className="loader-circle bg-pink-500"></span>
      </div>

      {/* 🔹 Animation Styles */}
      <style>{`
        .loader-circle {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          animation: move 1.5s ease-in-out infinite;
        }

        .loader-circle:nth-child(1) {
          left: 0;
          animation-delay: 0s;
        }

        .loader-circle:nth-child(2) {
          left: calc(50% - 8px);
          animation-delay: 0.25s;
        }

        .loader-circle:nth-child(3) {
          right: 0;
          animation-delay: 0.5s;
        }

        @keyframes move {
          0%, 100% {
            transform: translateX(0);
            z-index: 1;
          }
          25% {
            transform: translateX(100%);
            z-index: 2;
          }
          50% {
            transform: translateX(200%);
            z-index: 3;
          }
          75% {
            transform: translateX(100%);
            z-index: 2;
          }
        }
      `}</style>
    </div>
  );
}

export default SolutionPostLoader;
