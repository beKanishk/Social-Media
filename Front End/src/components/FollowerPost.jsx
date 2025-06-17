import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowingPosts } from "../redux/Follower/Action";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { WebSocketContext } from "../utils/WebSocketContext"; // ✅ for stompClient
import { sendMessage as sendMessageAction } from "../redux/Message/Action"; // ✅ Redux action
import SharePostModal from "./SharePostModal"; // ✅ assuming you have or will create this
import { toast } from "react-toastify";

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
    console.log("Receiver Id:", receiverId);
    
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
    // open modal to pick user to send to
    setPostToShare(postId);
    setShowShareModal(true);
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  if (loading) return <p className="text-center text-xl text-purple-700">Loading posts...</p>;

  return (
    <div className="mt-6 max-w-3xl mx-auto px-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => {
          const likes = postLikes[post.id] || [];
          const likedByYou = likes.some((like) => like.user?.id === user?.id);

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-3 border-2 border-purple-300"
                  />
                  <div>
                    <h5 className="font-semibold text-lg text-indigo-800 dark:text-indigo-300">
                      {post.user?.name}
                    </h5>
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

                <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
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
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comments</span>
                  </button>
                  <button
                    className="text-indigo-600 text-sm font-medium hover:underline"
                    onClick={() => handleSendPost(post.id)}
                  >
                    📤 Send in Chat
                  </button>
                </div>

                
              </div>
              

              {openComments[post.id] && (
                <div className="bg-gray-100 p-4 border-t border-gray-200 dark:border-gray-700">
                  <CommentSection postId={post.id} />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No posts to show from people you follow.
        </p>
      )}
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
