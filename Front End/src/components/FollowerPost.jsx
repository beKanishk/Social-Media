import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowingPosts } from "../redux/Follower/Action";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";

const FollowerPost = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(fetchFollowingPosts(jwt));
  }, [dispatch, jwt]);

  if (loading) return <p className="text-center text-xl text-purple-700">Loading posts...</p>;
// console.log("Posts-",posts);

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <img
                  src="/avatar.png" // replace with actual user profile image URL if available
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-3 border-2 border-purple-300"
                />
                <div>
                  <h5 className="font-semibold text-lg text-indigo-800 dark:text-indigo-300">{post.user?.name}</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={`http://localhost:8080${post.imageUrl}`}
                  alt="Post"
                  className="rounded-lg w-full max-h-80 object-cover mb-3"
                />
              )}
              <CommentSection postId={post.id} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No posts to show from people you follow.</p>
      )}
    </div>
  );
};

export default FollowerPost;
