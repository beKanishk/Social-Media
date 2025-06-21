import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowingPosts } from "../redux/Follower/Action";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { WebSocketContext } from "../utils/WebSocketContext";
import { sendMessage as sendMessageAction } from "../redux/Message/Action";
import SharePostModal from "./SharePostModal";
import { toast } from "react-toastify";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


const FollowerPost = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.follow);
  const { postLikes } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.auth);
  const { stompClient, connected } = useContext(WebSocketContext);
  const [postToShare, setPostToShare] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const jwt = localStorage.getItem("jwt");
  const [openComments, setOpenComments] = useState({});
  if (!user) return null;

  useEffect(() => {
    if (!hasFetched) {
      const token = localStorage.getItem("jwt");
      if (token) {
        dispatch(fetchFollowingPosts(token));
        setHasFetched(true);
      }
    }
  }, [hasFetched, dispatch]);

  useEffect(() => {
    posts.forEach((post) => {
      dispatch(fetchLikes(post.id));
    });
  }, [posts, dispatch]);

  const handleSendPostMessage = (receiverId, postId) => {
    if (!stompClient || !connected) return;
    const message = {
      content: "",
      receiverId,
      type: "POST",
      postId,
      messageSide: "SEND"
    };
    stompClient.publish({
      destination: "/app/chat.send",
      headers: { Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(message),
    });
    dispatch(sendMessageAction({
      ...message,
      senderName: "You",
      senderId: user.id,
      receiverId: receiverId,
      timestamp: new Date().toISOString(),
      read: true,
    }));
    toast.success("Post sent in chat!");
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSendPost = (postId) => {
    setPostToShare(postId);
    setShowShareModal(true);
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  if (loading) return <p className="text-center text-xl text-primary">Loading posts...</p>;

  return (
    <div className="mt-4 sm:mt-6 w-full max-w-screen-sm mx-auto px-2 sm:px-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => {
          const likes = postLikes[post.id] || [];
          const likedByYou = likes.some((like) => like.user?.id === user?.id);
          return (
            <Card
              key={post.id}
              className="mb-4 sm:mb-6 border bg-card shadow-md rounded-xl overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Avatar>
                  <img
                    src={post.user?.profilePictureUrl || "/avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-base text-foreground">
                    {post.user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </CardHeader>
  
              <Separator />
  
              <CardContent className="py-3">
                <p className="text-sm text-foreground mb-2 whitespace-pre-line">
                  {post.content}
                </p>
  
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="rounded-lg w-full h-auto max-h-[60vh] object-contain border"
                  />
                )}
              </CardContent>
  
              <CardFooter className="flex flex-col gap-3 border-t pt-3">
                {/* Like + Comment Buttons */}
                <div className="flex flex-col sm:flex-row w-full justify-between items-stretch gap-2">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant={likedByYou ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {likes.length}
                      {likedByYou && <Badge variant="secondary">Liked</Badge>}
                    </Button>
  
                    <Sheet open={openComments[post.id]} onOpenChange={(open) => toggleComments(post.id, open)}>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Comments
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

                  </div>
  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-primary flex justify-center"
                    onClick={() => handleSendPost(post.id)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send in Chat
                  </Button>
                </div>
  
              
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <p className="text-center text-muted-foreground text-sm sm:text-base">
          No posts to show from people you follow.
        </p>
      )}
  
      {/* Share Modal */}
      <SharePostModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={postToShare}
        onSend={(receiverId) => {
          handleSendPostMessage(receiverId, postToShare);
          setShowShareModal(false);
        }}
      />
    </div>
  );
  
};

export default FollowerPost;
