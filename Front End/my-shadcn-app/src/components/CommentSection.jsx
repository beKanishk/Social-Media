import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, deleteComment, fetchComments } from '../redux/Comment/Action';
import { formatDistanceToNow } from 'date-fns';
import { getUser } from '../redux/Auth/Action';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    // dispatch(getUser(localStorage.getItem("jwt")));
    // console.log("Comments", comments);
    
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
    <div className="mt-2 border-t border-border px-0">
      <form onSubmit={handleAddComment} className="flex items-center gap-1 min-h-0 w-full px-0 py-1">
        <Input
          type="text"
          value={message}
          placeholder="Write a comment..."
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 text-xs px-2 py-1 h-8 rounded-md bg-background border border-border"
        />
        <Button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-2 h-8 text-xs rounded-md"
        >
          Post
        </Button>
      </form>
      <div className="mt-1 sm:mt-3 space-y-1 sm:space-y-2">
        {comments.map((comment) => {
          const isCommentOwner = comment.user?.id === currentUserId;
          const isPostOwner = comment.post?.user?.id === currentUserId;
          const canDelete = isCommentOwner || isPostOwner;

          return (
            <div
              key={comment.id}
              className="flex items-start gap-3 py-3 border-b border-border"
            >
              <Avatar className="w-8 h-8 mt-1">
                <img src={ comment.user?.profilePictureUrl ? 
                  (comment.user?.profilePictureUrl):
                  ("/avatar.png")} 
                  alt="User avatar" />
              </Avatar>

              <div className="flex-1">
                {/* Username and time */}
                

                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="rounded-md px-2 py-2 bg-muted/20">
                  <span className="font-semibold text-foreground">
                    {comment.user.userName}
                  </span>
                  </div>

                  
                  <span className="text-muted-foreground text-[10px] sm:text-xs">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Comment message */}
                <p className="text-foreground text-sm sm:text-base mt-1 break-words whitespace-pre-wrap">
                  {comment.message}
                </p>
              </div>

              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(comment.id)}
                  className="text-destructive mt-1"
                >
                  🗑️
                </Button>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default CommentSection;
