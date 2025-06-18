import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, fetchPosts } from "../redux/Post/Action";
import CommentSection from "./CommentSection";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { postLikes } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    dispatch(fetchPosts(localStorage.getItem("jwt")));
  }, [dispatch]);

  useEffect(() => {
    posts.forEach((post) => {
      dispatch(fetchLikes(post.id));
    });
  }, [posts, dispatch]);

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading posts...</p>;

  return (
    <div className="mt-6 max-w-2xl mx-auto space-y-6 px-4">
      {posts.map((post) => {
        const likes = postLikes[post.id] || [];
        const likedByYou = likes.some((like) => like.user?.id === user?.id);

        return (
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

              <p className="text-gray-700  text-base">{post.content}</p>

              {post.imageUrl && (
                <img
                  src={`${post.imageUrl}`}
                  alt="Post"
                  className="mt-4 rounded-lg max-h-96 w-full object-cover border border-gray-300 dark:border-gray-600"
                />
              )}

              <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 hover:text-indigo-600 ${likedByYou ? "text-indigo-600 font-semibold" : ""}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {likes.length}
                    {likedByYou && <span className="text-xs ml-1">(Liked by you)</span>}
                  </button>
                </div>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 hover:text-indigo-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments</span>
                </button>
                <button
                  onClick={() => dispatch(deletePost(post.id))}
                  className="text-sm text-red-500 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {openComments[post.id] && (
              <div className="bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
                <CommentSection postId={post.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
