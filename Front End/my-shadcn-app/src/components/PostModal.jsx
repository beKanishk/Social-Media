import React, { useEffect, useState } from "react";
import * as Dialog from '@/components/ui/dialog';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentSection from "./CommentSection";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../redux/Post/Action";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const PostModal = ({ postId, open, onClose }) => {
  const dispatch = useDispatch();
  const { singlePost, singlePostLoading, singlePostError } = useSelector((state) => state.posts);
  const { postLikes } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);
  const jwt = localStorage.getItem("jwt");
  const [openComments, setOpenComments] = useState(false);

  useEffect(() => {
    if (postId && open) {
      dispatch(fetchPostById(postId, jwt));
      dispatch(fetchLikes(postId));
    }
  }, [postId, open, dispatch, jwt]);

  const handleLike = () => {
    if (singlePost) {
      dispatch(toggleLike(singlePost.id));
    }
  };

  const likes = singlePost ? (postLikes[singlePost.id] || []) : [];
  const likedByYou = likes.some((like) => like.user?.id === user?.id);

  return (
    <Dialog.Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="bg-black/60 fixed inset-0 z-50" />
        <Dialog.DialogContent className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-0 bg-background rounded-xl shadow-xl border-none" showCloseButton={true}>
          <Dialog.DialogTitle className="sr-only">Post</Dialog.DialogTitle>
          {singlePostLoading ? (
            <div className="p-8 text-center text-lg">Loading...</div>
          ) : singlePostError ? (
            <div className="p-8 text-center text-destructive">{singlePostError}</div>
          ) : singlePost ? (
            <Card className="bg-background border-none shadow-none rounded-xl">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Avatar>
                  <img
                    src={singlePost.user?.profilePictureUrl || "/avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Avatar>
                <div className="flex-1 flex flex-col items-start justify-center">
                  <span className="font-semibold text-base text-foreground leading-tight">{singlePost.user?.name}</span>
                  <span className="text-xs text-muted-foreground leading-tight">@{singlePost.user?.userName}</span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="py-3">
                <p className="text-sm text-foreground mb-2 whitespace-pre-line">
                  {singlePost.content}
                </p>
                {singlePost.imageUrl && (
                  <img
                    src={singlePost.imageUrl}
                    alt="Post"
                    className="rounded-lg w-full max-h-[60vh] object-contain border mb-2"
                  />
                )}
              </CardContent>
              <CardFooter className="flex flex-row gap-4 border-t pt-3 items-center">
                <Button
                  variant={likedByYou ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  {likes.length}
                  {likedByYou && <span className="text-xs text-primary">Liked</span>}
                </Button>
                <span className="text-sm text-muted-foreground">{likes.length} likes</span>
                <Sheet open={openComments} onOpenChange={setOpenComments}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex items-center gap-1"
                      aria-label="Open comments"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="w-full max-w-md mx-auto h-[80%] sm:rounded-t-xl px-4 py-4">
                    <SheetHeader>
                      <SheetTitle>Comments</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 overflow-y-auto h-[calc(100%-3rem)]">
                      <CommentSection postId={singlePost.id} />
                    </div>
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          ) : null}
        </Dialog.DialogContent>
      </Dialog.DialogPortal>
    </Dialog.Dialog>
  );
};

export default PostModal; 