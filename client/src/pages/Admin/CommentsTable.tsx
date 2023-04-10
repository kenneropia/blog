import React, { useState, useEffect } from "react";

import { EntityType } from "../../../../server/src/db";
import API from "../../api";
import Loading from "../../components/Loading";
import { useParams } from "react-router-dom";

const CommentsTable = () => {
  type TypedComments = EntityType.Comment[];
  const [comments, setComments] = useState<TypedComments>([]);
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    API.get(`/posts/${postId}/comments/admin`)
      .then((response) => {
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, []);

  const handleApproval = async (commentId: string) => {
    const { data } = await API.patch<{ comment: EntityType.Comment }>(
      `/posts/${postId}/comments/${commentId}`,
      {
        ...comments.find((comment) => comment.id === commentId),
        approved: true,
      }
    );

    setComments([
      ...comments.filter((comment) => comment.id !== commentId),
      data.comment,
    ]);
  };

  const handleDeleteComment = async (commentId: string) => {
    const { data } = await API.delete<{ comment: EntityType.Comment }>(
      `/comments/${commentId}`
    );
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Content</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id} className="border-b border-gray-300">
              <td className="p-2">{comment.name}</td>
              <td className="p-2">{comment.content}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="md:mr-5 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                {!comment.approved && (
                  <button
                    onClick={() => handleApproval(comment.id)}
                    className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsTable;
