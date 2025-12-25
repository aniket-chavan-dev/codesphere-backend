import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Send, Lightbulb } from "lucide-react";
import api from "../utilities/api";
import SolutionPostLoader from "../components/SolutionPostLoader";

export default function SolutionPost() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const code = location.state.code;
  let problem_title = location.state.title;
  problem_title = problem_title.replace("---", "--");
  problem_title = problem_title.split("-").join(" ");
  problem_title = problem_title.replace("  ", " - ");

  const [content, setContent] = useState(`# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->

# Approach
<!-- Describe your approach to solving the problem. -->

# Complexity
- Time complexity:
<!-- Add your time complexity here -->

- Space complexity:
<!-- Add your space complexity here -->

# Code
\`\`\`python
${code}
\`\`\`
`);

  const handlePost = async () => {
    setOpen(true);
    setIsLoading(true);
    try {
      const data = {
        problem_id: id,
        solution_content: content,
        title: title,
      };
      const res = await api.post("solutions/solution/", data);
    } catch (error) {
      console.log("error occurred during post the solution", error);
      setError(
        "Error Occured during post your Solution please try after some time!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Markdown toolbar
  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById("editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = content;

    switch (syntax) {
      case "bold":
        newText =
          content.substring(0, start) +
          `**${selectedText || "bold text"}**` +
          content.substring(end);
        break;
      case "italic":
        newText =
          content.substring(0, start) +
          `*${selectedText || "italic text"}*` +
          content.substring(end);
        break;
      case "heading":
        newText =
          content.substring(0, start) +
          `\n# ${selectedText || "Heading"}\n` +
          content.substring(end);
        break;
      case "link":
        newText =
          content.substring(0, start) +
          `[${selectedText || "link text"}](https://example.com)` +
          content.substring(end);
        break;
      case "table":
        newText =
          content.substring(0, start) +
          `\n| Column 1 | Column 2 |\n|-----------|-----------|\n| Value 1   | Value 2   |\n` +
          content.substring(end);
        break;
      default:
        break;
    }
    setContent(newText);
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col p-7 relative">
      <Navbar />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1f1f22] text-white p-6 rounded-2xl w-[450px] shadow-lg border border-gray-700"
          >
            {isLoading ? (
              <SolutionPostLoader />
            ) : (
              <div className="w-full">
                {error !== "" ? (
                  <div>
                    <h2 className="p-2 text-red-600 text-xl font-semibold">
                      Error Occured
                    </h2>
                    <p className="text-sm text-gray-400 p-2">{error}</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="p-2 text-green-600 text-xl font-semibold">
                      Post Successfully
                    </h2>
                    <p className="text-sm text-gray-400 p-2">
                      Your solution has been posted successfully.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 p-2 items-center">
                  <div
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-800 cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </div>
                  <div
                    className="p-2 bg-green-500 rounded-lg cursor-pointer hover:bg-green-700"
                    onClick={() => navigate(`/problems/${problem_title}`)}
                  >
                    Go to Problem
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title + Buttons */}
      <div className="flex justify-between items-center gap-3">
        <input
          type="text"
          placeholder="Enter solution title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[85%] p-3 mb-4 bg-[#161618] text-white text-lg rounded-md border border-gray-700 focus:border-blue-500 outline-none"
        />
        <div className="flex gap-2 items-center w-[20%] pb-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            className={`p-2 bg-green-500 rounded-lg flex gap-2 items-center ${
              title === ""
                ? "cursor-not-allowed bg-green-900"
                : "cursor-pointer hover:bg-green-700"
            }`}
            disabled={title === ""}
            onClick={handlePost}
          >
            <Send size={20} />
            <span className="font-medium text-sm text-white">Post</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between pr-8 relative ">
        <div className="flex space-x-3 mb-3 bg-[#161618] p-2 rounded-md border border-gray-700">
          <button
            onClick={() => insertMarkdown("heading")}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-semibold"
          >
            H
          </button>
          <button
            onClick={() => insertMarkdown("bold")}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-bold"
          >
            B
          </button>
          <button
            onClick={() => insertMarkdown("italic")}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm italic"
          >
            I
          </button>
          <button
            onClick={() => insertMarkdown("link")}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
          >
            🔗
          </button>
          <button
            onClick={() => insertMarkdown("table")}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
          >
            Table
          </button>
        </div>

        <div
          className="h-10 w-10 flex items-center justify-center hover:bg-yellow-800 rounded-lg group"
          onClick={() => navigate("/markdown-helper")}
        >
          <Lightbulb size={20} fill="yellow" className="cursor-pointer" />
          <div className="hidden group-hover:flex bg-[#1f1f22] absolute bottom-0 right-4 border border-gray-600 rounded-lg text-gray-300 px-2 py-1 text-sm translate-y-5 translate-x-6">
            Markdown Guide
          </div>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* Markdown Editor */}
        <textarea
          id="editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-1/2 h-[80vh] p-4 bg-[#161618] text-gray-200 rounded-md border border-gray-700 outline-none resize-none focus:border-blue-500 font-mono text-sm"
        />

        {/* Markdown Preview */}
        <div className="w-1/2 h-[80vh] overflow-y-auto p-4 bg-[#111113] rounded-md border border-gray-700 prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl font-bold text-white mt-4 mb-3 border-b border-gray-700 pb-1"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-semibold text-gray-200 mt-3 mb-2"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-blue-400 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      background: "#1a1a1d",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-[#1e1e22] text-blue-300 px-1 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ node, ...props }) => (
                <table
                  className="border border-gray-700 w-full border-collapse text-sm my-4"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-gray-700 px-2 py-1 bg-[#1a1a1d] text-gray-300 font-semibold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border border-gray-700 px-2 py-1 text-gray-300"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-600 pl-3 italic text-gray-400"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
