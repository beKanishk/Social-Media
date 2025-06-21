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

  return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* Full height minus navbar (64px = 4rem) */}
        <div className="flex gap-6 max-w-6xl mx-auto h-[calc(100vh-2rem)] sm:mt-8 sm:px-4 md:ml-64">
          
          {/* Sidebar (Desktop) */}
          <div className="hidden sm:block w-80 h-full overflow-y-auto border-r">
            <SuggestionsSidebar onUserSelect={setChatPartner} />
          </div>

          {/* Chat (Desktop) */}
          <div className="hidden sm:flex flex-1 h-full">
            {chatPartner ? (
              <ChatWindow receiverId={chatPartner.userId} containerHeight="h-full" />
            ) : (
              <div className="m-auto text-muted-foreground">Select a user to start chatting.</div>
            )}
          </div>

          {/* Mobile View: Show Sidebar or Chat */}
          <div className="block sm:hidden w-full h-[calc(100vh-4rem)] overflow-y-auto pt-12">
            {!chatPartner ? (
              <SuggestionsSidebar onUserSelect={setChatPartner} />
            ) : (
              <ChatWindow
                receiverId={chatPartner.userId}
                containerHeight="h-full"
                onBack={() => setChatPartner(null)}
              />
            )}
          </div>

        </div>
      </div>
  );
};

export default ChatPage

