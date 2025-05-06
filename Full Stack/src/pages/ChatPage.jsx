// src/pages/ChatPage.jsx
import React, { useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import WebSocketProvider from "../utils/WebSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/Auth/Action";

const ChatPage = () => {

  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")))
  }, [dispatch])

  const userEmail = user.userEmail; // Replace with Redux selector if stored globally
  const chatPartnerId = 52; // Example: Chatting with user ID 2

  return (
    <WebSocketProvider userEmail={userEmail}>
      <ChatWindow receiverId={chatPartnerId} />
    </WebSocketProvider>
  );
};

export default ChatPage;
