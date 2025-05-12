import React, { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import WebSocketProvider from "../utils/WebSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/Auth/Action";
import SuggestionsSidebar from "../components/SuggestionsSidebar";
import Navbar from "../components/Navbar";


const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [chatPartner, setChatPartner] = useState(null);

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [dispatch]);

  useEffect(() => {
    console.log("Chat partner in chat page",chatPartner);
  }, [chatPartner])

  // const userEmail = user?.userEmail;

  return (
    <>
      <Navbar/>
      <div className="flex gap-6">
        <SuggestionsSidebar onUserSelect={setChatPartner} />
        <div className="flex-1">
          {chatPartner && chatPartner.userEmail && (
            // <WebSocketProvider userEmail={chatPartner.userEmail}>
              <ChatWindow receiverId={chatPartner.userId} />
            // </WebSocketProvider>
          )}
        </div>
      </div>
    </>
    
  );
};

export default ChatPage;
