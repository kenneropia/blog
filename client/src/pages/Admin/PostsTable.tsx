import React, { useState, useEffect } from "react";
import { EntityType } from "../../../../server/src/db";
import API from "../../api";
import Loading from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";

const PostsTable = () => {
  type TypedPosts = EntityType.Post[];
  const [posts, setPosts] = useState<TypedPosts>([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    API.get("/posts")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }, []);

  const handleDeletePost = async (postId: string) => {
    const { data } = await API.delete<{ post: EntityType.Post }>(
      `/posts/${postId}`
    );
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Comments</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-300">
              <td className="p-2 text-blue-500 underline">
                <Link to={`/${post.id}`}>{post.title}</Link>
              </td>
              <td className=" underline text-blue-500">
                <Link to={`/admin/posts/${post.id}/comments`}>
                  view comments
                </Link>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="md:mr-5 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 hover:text-gray-900 transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsTable;
