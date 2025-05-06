import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/Post/Action";
import CommentSection from "./CommentSection";
import { MessageCircle } from "lucide-react"; // Lucide comment icon

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    dispatch(fetchPosts(localStorage.getItem("jwt")));
  }, [dispatch]);

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading posts...</p>;

  return (
    <div className="mt-6 max-w-2xl mx-auto space-y-6 px-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition hover:shadow-2xl"
        >
          <div className="p-5">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">
                {post.user?.name?.charAt(0)}
              </div>
              <div>
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {post.user?.name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user?.userName}</p>
              </div>
            </div>

            <p className="text-gray-700 text-base">{post.content}</p>

            {post.imageUrl && (
              <img
                src={`http://localhost:8080${post.imageUrl}`}
                alt="Post"
                className="mt-4 rounded-lg max-h-96 w-full object-cover border border-gray-300 dark:border-gray-600"
              />
            )}

            {/* Comment Toggle Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
            </div>
          </div>

          {openComments[post.id] && (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
