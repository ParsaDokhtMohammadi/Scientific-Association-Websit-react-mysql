import { useState } from "react";
import {
  useGetEventCommentsQuery,
  useCommentOnEventMutation,
  useDeleteEventCommentMutation
} from "../services/ApiSlice";
import { useSelector } from "react-redux";
const Comments = ({ event_id }) => {
  const [content, setContent] = useState("");
  const User = useSelector((state) => state.CurrentUser.CurrentUser);
  const [user_id, setUserId] = useState(User.id);
  const { data: comments, isLoading } = useGetEventCommentsQuery(event_id);
  const [Comment,{}] = useCommentOnEventMutation();
  const [DeleteComment,{error}] = useDeleteEventCommentMutation()
  const submit = async (e) => {
    e.preventDefault();
    await Comment({ user_id, event_id, content });
    setContent("");
  };

  return (
    <div className="flex flex-col gap-6 bg-[#1A1A1A] text-[#F5F5F5] p-6 rounded-lg shadow-lg max-w-[800px] mx-auto">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label htmlFor="content" className="font-semibold text-[#06B6D4]">
          Comment
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
        ></textarea>
        <button
          type="submit"
          className="bg-[#06B6D4] text-[#1A1A1A] font-bold py-2 px-4 rounded-md hover:bg-[#0891B2] transition-colors duration-200"
          onClick={submit}
        >
          Comment
        </button>
      </form>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-center text-[#A3A3A3]">Loading comments...</p>
        ) : comments?.data?.length > 0 ? (
          comments.data.map((comment) => (
            <div key={comment.id} className="bg-[#2A2A2A] rounded-md p-4">
              <div className="flex flex-row justify-between text-sm text-[#A3A3A3] mb-2">
                <div className="flex gap-3 flex-col mb-2">
                <span className="font-semibold text-[#06B6D4] w-[75px]">
                  {comment.user_name}
                </span>
              <button
                className={` ${User.id===comment.user_id || User.role === "admin" ?"block":"hidden"}  bg-[#06B6D4] hover:bg-[#0891B2] text-white font-bold py-0.5 px-3 rounded transition-colors duration-200`}
                onClick={() => DeleteComment(comment.id)}
              >
                Delete
              </button>

                </div>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-[#F5F5F5]">{comment.content}</p>

            </div>
          ))
        ) : (
          <p className="text-center text-[#A3A3A3]">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
