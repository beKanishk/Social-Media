// utils/WebSocketContext.jsx
import React, { createContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch } from "react-redux";
import { markMessagesAsRead, receiveMessage } from "../redux/Message/Action";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children, userEmail }) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);
  const dispatch = useDispatch();
  const stompRef = useRef(null);

  useEffect(() => {
    if (!userEmail) return; // ⛔ wait until userEmail is available

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      console.warn("⚠️ JWT not found. Skipping WebSocket connection.");
      return;
    }

    // const protocol = window.location.protocol === "https:" ? "https" : "http";
    // const backendHost = import.meta.env.VITE_BACKEND_HOST; // e.g. "your-backend.com"
    const encodedJwt = encodeURIComponent(jwt); // Make sure it's encoded

    const socketUrl = `${import.meta.env.VITE_BACKEND_URL}/ws?jwt=${encodedJwt}`;


    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
        setClient(stompClient);
        stompRef.current = stompClient;

        stompClient.subscribe(`/user/${userEmail}/queue/messages`, (message) => {
          try {
            const msg = JSON.parse(message.body);
            // console.log("📩 Received:", msg);

            const activeChatId = parseInt(localStorage.getItem("activeChatId") || "0", 10);
            if (activeChatId && (msg.senderId === activeChatId || msg.receiverId === activeChatId)) {
              dispatch(receiveMessage(msg));
            }
            if (msg.senderId === activeChatId) {
              dispatch(markMessagesAsRead(msg.senderId));
            }
          } catch (err) {
            console.error("⚠️ WebSocket parse error:", err);
          }
        });
      },
      onDisconnect: () => {
        console.log("❌ WebSocket disconnected");
        setConnected(false);
        setClient(null);
        stompRef.current = null;
      },
    });

    stompClient.activate();

    return () => {
      stompRef.current?.deactivate();
    };
  }, [userEmail, dispatch]);

  return (
    <WebSocketContext.Provider value={{ stompClient: client, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
