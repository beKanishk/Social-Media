import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendHorizonal } from "lucide-react";
import axios from "axios";
import { WebSocketContext } from "../utils/WebSocketContext";
import { setMessages, sendMessage as sendMessageAction } from "../redux/Message/Action";

const ChatWindow = ({ receiverId }) => {
  const { stompClient, connected } = useContext(WebSocketContext);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/chat/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch(setMessages(res.data)); // ✅ Set in Redux
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
  
    const message = {
      content,
      receiverId,
      type: "TEXT",
      messageSide: "SEND",
      postId: null,
    };
  
    stompClient.publish({
      destination: "/app/chat.send",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(message),
    });
  
    dispatch(sendMessageAction({
      ...message,
      senderName: "You",
      timestamp: new Date().toISOString(),
    }));
  
    setContent("");
  };
  

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 shadow rounded-lg p-4 h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col text-sm">
            <span className="text-gray-500">{msg.senderName}</span>
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-md text-gray-900 dark:text-white">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex mt-4 border-t pt-2 border-gray-300">
        <input
          className="flex-1 p-2 rounded-l-md bg-gray-100 text-black dark:text-white"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
