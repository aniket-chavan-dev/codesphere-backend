import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Calendar, Eye, MessageCirclePlus } from "lucide-react";
import api from "../../utilities/api";
import DetailedSolutionLoader from "./DetailedSolutionLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomeSelection from "../common/CustomeSelection";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/successMessageDisplaySlice";
import { useSelector } from "react-redux";
import DisplayComments from "./DisplayComments";
import CopyCom from "../common/CopyCom";

function DetailedSolution({
  selectedSolutionId,
  setIsShowDetailedSolution,
  setSelectedSolutionId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [content, setContent] = useState("");
  const [sortComments, setSortComments] = useState("Recent");
  const [comment, setComment] = useState("");
  const [postCommentLoading, setPostCommentLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const commentContentRef = useRef(null);
  const [isPostCommentSuccessfully, setPostCommentSuccessFully] =
    useState(false);

  const [isShowReplyInput, setShowReplyInput] = useState(false);

  const [replyParentId, setReplyParentId] = useState(null);

  const optionsForSortComments = ["Recent", "Most Views", "Most Likes"];

  const dispatch = useDispatch();

  function removeHTMLComments(content) {
    return content.replace(/<!--[\s\S]*?-->/g, "").trim();
  }

  const fetchedSolution = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/solutions/solution/${selectedSolutionId}`);
      const data = res.data;
      console.log(data, "data");
      setSolution(data);
      setContent(removeHTMLComments(data.solution_content));
      setCommentData(data.comments);
    } catch (error) {
      console.log("error while fetched solution", error);
    } finally {
      setIsLoading(false);
    }
  };

  const user = useSelector((state) => state.user.user);

  const postComment = async (parent, content) => {
    setPostCommentLoading(true);
    setPostCommentSuccessFully(false);
    try {
      const res = await api.post("comments/comment/", {
        model_name: "Solutions",
        object_id: solution?.id,
        content: content,
        parent: parent,
      });

      const data = res.data;
      console.log(data);
      setPostCommentSuccessFully(true);
      dispatch(setMessage("Comment Posted Successfully !"));
    } catch (error) {
      console.log("error occured when try to post comment", error);
    } finally {
      setPostCommentLoading(false);
    }
  };

  const formatedDate = (date) => {
    const con_date = new Date(date);
    return con_date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchedSolution();
    if (isPostCommentSuccessfully) fetchedSolution();
  }, [isPostCommentSuccessfully]);

  useEffect(() => {
    if (commentContentRef.current) {
      const el = commentContentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, []);

  if (isLoading) return <DetailedSolutionLoader />;

  return (
    <div className="p-4 w-full flex flex-col gap-2">
      <div
        className="flex gap-3 items-center text-textdarkish cursor-pointer"
        onClick={() => {
          setIsShowDetailedSolution(false);
          setSelectedSolutionId(null);
        }}
      >
        <ArrowLeft />
        <div>All Submissions</div>
      </div>

      <h3 className="text-lg font-semibold pt-2">{solution?.title}</h3>
      <div className="flex gap-3 items-center">
        <div className="w-13 h-13 rounded-full bg-black flex justify-center items-center text-blue-500">
          {solution?.user.first_name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium flex gap-2 ">
            <span>
              {solution?.user.first_name} {solution?.user.last_name}
            </span>
            <span className="flex gap-2 text-textdarkish">
              <Calendar size={18} /> {formatedDate(solution?.created_at)}
            </span>
          </div>
          <div className="flex gap-2 items-center text-textdarkish">
            <Eye size={20} />
            <span>{solution?.views_count}</span>
          </div>
        </div>
      </div>

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
              <div className="relative cursor-pointer group">
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
                  className=""
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
                <CopyCom text={String(children).replace(/\n$/, "")} />
              </div>
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

      <div className="flex justify-between items-center px-2 pt-2">
        <div className="flex gap-2 items-center">
          <span className="text-textdarkish">
            {" "}
            <MessageCirclePlus size={20} />
          </span>
          <span> Comments</span>
        </div>

        <CustomeSelection
          selectedOption={sortComments}
          options={optionsForSortComments}
          setSelectedOption={setSortComments}
        />
      </div>

      <div className="w-full p-4 bg-grey rounded-xl">
        <textarea
          placeholder="Type comment here"
          className="w-full text-white h-[100px] p-2 outline-none resize-none  bg-grey rounded-lg"
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end pr-2">
          <div
            className={`p-2 ${
              comment == "" || postCommentLoading
                ? "bg-green-900 cursor-not-allowed"
                : "bg-green-600 cursor-pointer hover:bg-green-400 transition-all duration-150"
            } text-sm text-white rounded-lg   font-normal`}
            disabled={comment == ""}
            onClick={() => postComment(null, comment)}
          >
            Comment
          </div>
        </div>
      </div>

      <DisplayComments
        commentData={commentData}
        formatedDate={formatedDate}
        commentContentRef={commentContentRef}
        showMore={showMore}
        setShowMore={setShowMore}
        isOverflowing={isOverflowing}
        setIsOverflowing={setIsOverflowing}
        isShowReplyInput={isShowReplyInput}
        setShowReplyInput={setShowReplyInput}
        replyParentId={replyParentId}
        setReplyParentId={setReplyParentId}
        postComment={postComment}
        setCommentData={setCommentData}
      />
    </div>
  );
}

export default DetailedSolution;
