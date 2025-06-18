import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendHorizonal } from "lucide-react";
import axios from "axios";
import { WebSocketContext } from "../utils/WebSocketContext";
import { setMessages, sendMessage as sendMessageAction, markMessagesAsRead } from "../redux/Message/Action";
import { getUser } from "../redux/Auth/Action";

const ChatWindow = ({ receiverId }) => {
  const { stompClient, connected } = useContext(WebSocketContext);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (receiverId) {
      localStorage.setItem("activeChatId", receiverId); // 🟢 Used in WebSocket
    }
    return () => {
      localStorage.removeItem("activeChatId");
    };
  }, [receiverId]);
  
  useEffect(() => {
    if (receiverId) {
      dispatch(markMessagesAsRead(receiverId));
    }
  }, [receiverId, dispatch]);

  useEffect(() => {
    dispatch(getUser(jwt));
    
  }, [dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/chat/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Message :", res.data);
        
        dispatch(setMessages(res.data));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    if (receiverId) fetchMessages();
  }, [receiverId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!connected || !stompClient || typeof stompClient.publish !== "function") {
      console.warn("STOMP client not ready or not connected.");
      return;
    }

    if (!content.trim()) return;

    const message = {
      content,
      receiverId,
      type: "TEXT",
      messageSide: "SEND",
      postId: null,
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

    setContent("");
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[85vh] rounded-xl shadow bg-gray-100 dark:bg-gray-900 flex flex-col border border-gray-300 dark:border-gray-700">
      <div className="bg-gray-200 dark:bg-gray-800 px-6 py-3 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-white">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 italic mt-20">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, i) => {
            const isSender = msg?.senderId === user?.id;
            return (
              <div key={i} className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                <span className="text-xs text-gray-400 mb-1 px-1">
                  {isSender ? "You" : msg.senderName}
                  {!isSender && !msg?.read && (
                    <span className="ml-2 text-red-500 font-semibold">• New</span>
                  )}
                </span>
                <div className={`max-w-xs px-4 py-2 text-sm rounded-lg shadow-sm ${
                  isSender
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none"
                }`}>
                  {msg.type === "POST" ? (
                    <div className="border rounded-md p-2 mt-1 bg-gray-100 dark:bg-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">Shared a post:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{msg.content}</p>
                      {msg.postImageURL && (
                        <img
                          src={`http://localhost:8080${msg.postImageURL}`}
                          alt="Shared Post"
                          className="w-full max-h-60 object-cover rounded"
                        />
                      )}
                    </div>
                  ) : (
                    <div>{msg.content}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>


      <div className="border-t border-gray-300 dark:border-gray-700 p-3 flex items-center gap-3 bg-white dark:bg-gray-900">
        <textarea
          rows={1}
          placeholder="Type your message..."
          className="flex-1 resize-none p-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="p-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-lg"
          aria-label="Send message"
        >
          <SendHorizonal className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
