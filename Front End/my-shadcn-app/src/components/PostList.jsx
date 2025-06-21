import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, fetchPosts } from "../redux/Post/Action";
import CommentSection from "./CommentSection";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

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

  const toggleComments = (postId, value) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };
  

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-2 sm:mt-4 max-w-full sm:max-w-2xl mx-auto space-y-4 px-2 sm:px-4">
      {posts?.map((post) => {
        const likes = postLikes[post.id] || [];
        const likedByYou = likes.some((like) => like.user?.id === user?.id);

        return (
          <Card
            key={post.id}
            className="rounded-lg shadow-md transition hover:shadow-lg border bg-card px-3 py-2 sm:px-6 sm:py-4 max-w-[95%] sm:max-w-2xl mx-auto"
          >
            <CardHeader className="flex flex-row items-center gap-2 sm:gap-4 pb-0">
              <Avatar className="w-10 h-10">
                {post.user?.profilePictureUrl ? (
                  <img
                    src={post.user.profilePictureUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg uppercase">
                    {post.user?.name?.charAt(0)}
                  </div>
                )}
              </Avatar>
              <div>
                <h5 className="text-base sm:text-lg font-semibold text-foreground">{post.user?.name}</h5>
                <p className="text-xs sm:text-sm text-muted-foreground">@{post.user?.userName}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-foreground text-sm sm:text-base mb-2">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={`${post.imageUrl}`}
                  alt="Post"
                  className="rounded-lg w-full h-auto max-h-[60vh] object-contain mb-3"
                />
              )}
              <div className="mt-4 border-t border-border pt-3 flex justify-around items-center w-full text-muted-foreground">
                {/* Like Button */}
                <Button
                  variant="ghost"
                  onClick={() => handleLike(post.id)}
                  className="flex flex-col items-center gap-1 text-xs sm:text-sm"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{likes.length}</span>
                  {likedByYou && <span className="text-[10px] text-primary">(You)</span>}
                </Button>

                {/* Comment Button */}
                <Sheet open={openComments[post.id]} onOpenChange={(open) => toggleComments(post.id, open)}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex items-center gap-0 sm:gap-1 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Comments</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="w-full max-w-md mx-auto h-[80%] sm:rounded-t-xl px-4 py-4">

                    <SheetHeader>
                      <SheetTitle>Comments</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 overflow-y-auto h-[calc(100%-3rem)]">
                      <CommentSection postId={post.id} />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  onClick={() => dispatch(deletePost(post.id))}
                  className="flex flex-col items-center gap-1 text-xs sm:text-sm text-red-500"
                >
                  <span className="text-xl">🗑️</span>
                  <span>Delete</span>
                </Button>
              </div>

              
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PostList;
