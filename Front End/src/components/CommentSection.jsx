import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, deleteComment, fetchComments } from '../redux/Comment/Action';
import { formatDistanceToNow } from 'date-fns';
import { getUser } from '../redux/Auth/Action';

const CommentSection = ({ postId}) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const { commentsByPost, loading } = useSelector((state) => state.comments);
  const {user} = useSelector((state) => state.auth);
  const comments = Array.isArray(commentsByPost[postId]) ? commentsByPost[postId] : [];
// console.log("Comments",comments);
// console.log("User" ,user);

  const currentUserId = user?.id;
  useEffect(() => {
    dispatch(fetchComments(postId));
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [dispatch, postId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(createComment(postId, message));
      setMessage('');
    }
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId, postId));
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleAddComment} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          placeholder="Write a comment..."
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition duration-150 disabled:opacity-50"
        >
          Post
        </button>
      </form>

      <div className="mt-4 space-y-4">
        {comments.map((comment) => {
          const isCommentOwner = comment.user?.id === currentUserId;
          const isPostOwner = comment.post?.user?.id === currentUserId;
          const canDelete = isCommentOwner || isPostOwner;
          // console.log("Comment owner id",comment.user?.id);
          // console.log("Postowner id",comment.post?.user?.id);
          // console.log("Current Userid",currentUserId);
          
          
          
          return (
            <div key={comment.id} className="flex items-start space-x-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
              <img
                src="/avatar.png"
                alt="User avatar"
                className="w-8 h-8 rounded-full border border-indigo-300"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold dark:text-indigo-300">{comment.user.userName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-100 mt-1">{comment.message}</p>
              </div>
              {canDelete && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
