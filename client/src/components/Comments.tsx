import React, { useState, useEffect } from "react";
import { EntityType } from "../../../server/src/db";
import API from "../api";
import { toast } from "react-hot-toast";

type CommentType = EntityType.Comment & {
  createdAt: string;
};

type CommentProps = {
  postId: string;
};

const Comments: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(`/posts/${postId}/comments`).then((res) => {
      setComments(res.data.comments);
      setIsLoading(false);
    });
    setIsLoading(false);
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await API.post(`/posts/${postId}/comments`, {
      name,
      content,
    });

    setComments([...comments, res.data.comment]);
    setName("");
    setContent("");
    toast.success(
      "Comment submitted successfully, will be displayed after approval"
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col mb-4">
          <label htmlFor="name" className="font-bold mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="border border-gray-400 p-2 rounded-lg"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="content" className="font-bold mb-1">
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="border border-gray-400 p-2 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {comments
            .filter((item) => item.approved == true)
            .map((comment) => (
              <div key={comment.id} className="border-b border-gray-400 mb-4">
                <p className="text-gray-600 mb-1">
                  {comment.name} -{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-1">{comment.content}</p>
              </div>
            ))}
          {comments.length === 0 && <p>No comments yet.</p>}
          <button
            onClick={() => {
              const page = Math.floor(comments.length / 5) + 1;
              API.get(`/posts/${postId}/comments?page=${page}`).then((res) => {
                setComments([...comments, ...res.data.comments]);
              });
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Load more comments
          </button>
        </>
      )}
    </div>
  );
};

export default Comments;
