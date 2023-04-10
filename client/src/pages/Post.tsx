import React, { useState, useEffect } from "react";
import Comments from "../components/Comments";
import { Link, useParams } from "react-router-dom";

import { EntityType } from "../api/schema";
import API from "../api";
import Loading from "../components/Loading";

const Post = () => {
  type PostType = EntityType.Post & {
    category: EntityType.Category;
    tags: EntityType.Tag[];
  };

  const [post, setPost] = useState<PostType | null>(null);
  const [error, setError] = useState();
  const { id } = useParams();
  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data.post);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, []);
  if (error) return <PostNotFound />;
  if (!post) return <Loading />;
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">
          Posted on {new Date(post.createdAt).toLocaleDateString()} in{" "}
          <span key={post.category.id} className="text-sm">
            {post.category.name}
          </span>
          {" / "}
          {post.tags.map((tag) => (
            <span key={tag.id} className="text-sm">
              {tag.name}
            </span>
          ))}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <Comments postId={id!} />
    </div>
  );
};

const PostNotFound = () => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <p className="font-bold">Sorry, post was not found.</p>
    </div>
  );
};
export default Post;
