import React, { useState } from "react";
import {
  MessageCirclePlus,
  Pencil,
  Share,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../utilities/api";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/successMessageDisplaySlice";

function DisplayComments({
  commentData,
  formatedDate,
  commentContentRef,
  showMore,
  setShowMore,
  isOverflowing,
  replyParentId,
  setReplyParentId,
  isShowReplyInput,
  setShowReplyInput,
  postComment,
  setCommentData,
  isReply,
}) {
  const user = useSelector((state) => state.user.user);
  const [showReplies, setShowReplies] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [showRepliesParentId, setShowRepliesParentid] = useState(null);
  const [isShowEditComment, setShowEditComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const dispatch = useDispatch();

  // helper to recursively update comment (and nested replies)
  const updateCommentLikes = (comments, id, isLiked) => {
    return comments.map((item) => {
      if (item.id === id) {
        // update the matched comment or reply
        return {
          ...item,
          is_liked: isLiked,
          likes_count: isLiked ? item.likes_count + 1 : item.likes_count - 1,
        };
      }

      // if there are replies, recursively search and update
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: updateCommentLikes(item.replies, id, isLiked),
        };
      }
      return item;
    });
  };

  const updateCommentAfterDelete = (comments, id) => {
    return comments
      .map((item) => {
        // If this comment has replies, recursively clean them up
        if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: updateCommentAfterDelete(item.replies, id),
          };
        }
        return item;
      })
      .filter((item) => item.id !== id);
  };

  const updateCommentAfterEdit = (comments, id, data) => {
    return comments.map((item) => {
      if (item.id == id) {
        return data;
      }
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: updateCommentAfterEdit(item.replies, id, data),
        };
      }
      return item;
    });
  };

  const likedComment = async (id) => {
    try {
      const res = await api.post(`comments/comment/like/`, { id });
      const data = res.data;

      if (res.status === 201) {
        setCommentData((prev) => updateCommentLikes(prev, id, true));
      } else {
        setCommentData((prev) => updateCommentLikes(prev, id, false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      const res = await api.delete(`comments/comment/delete/${id}`);
      if (res.status == 200) {
        setCommentData((pre) => updateCommentAfterDelete(pre, id));
        dispatch(setMessage("Comment Deleted Successfully !"));
      }
    } catch (error) {
      console.log("error occured during deleting comment", error);
    }
  };

  const editComment = async (id) => {
    try {
      const res = await api.put(`comments/comment/update/${id}`, {
        content: editCommentText,
      });
      const data = res.data;
      setCommentData((pre) => updateCommentAfterEdit(pre, id, data));
      dispatch(setMessage("Comment Edited Successfully !"));
    } catch (error) {
      console.log("error during edit comment", error);
    }
  };

  return commentData?.length !== 0 ? (
    commentData?.map((comment, index) => (
      <div
        className="flex gap-2 items-start py-2 border-b-1 border-bordergrey"
        key={comment.id}
      >
        <div className="w-12 h-12 rounded-full bg-black flex justify-center items-center shrink-0">
          <span className=" text-blue-500">
            {comment.user.first_name.charAt(0)}
          </span>
        </div>

        {isShowEditComment ? (
          <div className="bg-grey flex flex-col p-2 w-full rounded-lg">
            <textarea
              className="resize-none w-full outline-none"
              onChange={(e) => setEditCommentText(e.target.value)}
              defaultValue={comment.content}
            ></textarea>
            <div className="flex justify-end items-center gap-2">
              <button
                className="p-2 bg-grey hover:bg-bordergrey rounded-lg cursor-pointer"
                onClick={() => setShowEditComment(false)}
              >
                Cancel
              </button>
              <button
                className={`p-2 ${
                  editCommentText == ""
                    ? "bg-green-900 cursor-not-allowed"
                    : "bg-green-600 cursor-pointer hover:bg-green-400 transition-all duration-150"
                } text-sm text-white rounded-lg   font-normal`}
                onClick={() => {
                  editComment(comment.id);
                  setShowEditComment(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <div className="text-white font-semibold text-sm">
              {comment.user.first_name} {comment.user.last_name}
            </div>
            <div className="text-sm text-textdarkish">
              {formatedDate(comment.created_at)}
            </div>

            <div
              ref={commentContentRef}
              className={`text-sm text-white font-normal transition-all duration-300 ${
                showMore ? "line-clamp-none" : "line-clamp-3"
              }`}
            >
              {comment.content}
            </div>
            {isOverflowing && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-400 text-sm font-medium mt-1 hover:underline cursor-pointer"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}

            <div className="pt-2 flex gap-2 text-textdarkish items-center">
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => {
                  likedComment(comment.id);
                }}
              >
                <ThumbsUp size={18} fill={comment.is_liked && "white"} />{" "}
                <span>{comment.likes_count}</span>
              </div>
              <button
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => {
                  setShowRepliesParentid(comment.id);
                  setShowReplies((pre) => !pre);
                }}
                disabled={!comment.replies.length}
              >
                <MessageCirclePlus size={18} />{" "}
                <span>Show {comment.replies.length} Replies</span>
              </button>
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => {
                  setReplyParentId(comment.id);
                  setShowReplyInput((pre) => !pre);
                }}
              >
                <Share size={18} /> <span>Reply</span>
              </div>
              {comment.user.email === user.email && (
                <div className="flex gap-2 items-center">
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => setShowEditComment(true)}
                  >
                    <Pencil size={18} />
                    <span>edit</span>
                  </div>
                  <div
                    className="text-red-500 flex gap-1 items-center cursor-pointer"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <Trash size={18} />
                    <span>delete</span>
                  </div>
                </div>
              )}
            </div>

            {isShowReplyInput && comment.id == replyParentId && (
              <div className="pt-2 flex gap-2 items-center">
                <div className="w-12 h-12 rounded-full bg-black flex justify-center items-center shrink-0">
                  <span className=" text-blue-500">
                    {comment.user.first_name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 w-full">
                  <textarea
                    type="text"
                    placeholder="write reply here"
                    className="flex-1  w-full bg-grey p-2 rounded-lg outline-none text-white resize-none"
                    onChange={(e) => setReplyText(e.target.value)}
                  />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-2 bg-grey hover:bg-bordergrey rounded-lg cursor-pointer"
                      onClick={() => {
                        setReplyText("");
                        setShowReplyInput(false);
                      }}
                    >
                      Cancel
                    </button>
                    <div
                      className={`p-2 ${
                        replyText == ""
                          ? "bg-green-900 cursor-not-allowed"
                          : "bg-green-600 cursor-pointer hover:bg-green-400 transition-all duration-150"
                      } text-sm text-white rounded-lg   font-normal`}
                      disabled={comment == ""}
                      onClick={() => postComment(comment.id, replyText)}
                    >
                      Replay
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showReplies && comment.id == showRepliesParentId && (
              <DisplayComments
                commentData={comment.replies}
                formatedDate={formatedDate}
                commentContentRef={commentContentRef}
                showMore={showMore}
                setShowMore={setShowMore}
                isOverflowing={isOverflowing}
                isShowReplyInput={isShowReplyInput}
                setShowReplyInput={setShowReplyInput}
                replyParentId={replyParentId}
                setReplyParentId={setReplyParentId}
                postComment={postComment}
                setCommentData={setCommentData}
                isReply={true}
              />
            )}
          </div>
        )}
      </div>
    ))
  ) : !isReply ? (
    <div>No comment yet</div>
  ) : null;
}

export default DisplayComments;
