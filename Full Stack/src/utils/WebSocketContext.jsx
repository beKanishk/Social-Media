import React, { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch } from "react-redux";
import { receiveMessage } from "../redux/Message/Action";


export const WebSocketContext = createContext();

const WebSocketProvider = ({ children, userEmail }) => {
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState(null);
  const dispatch = useDispatch(); // ✅

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const encodedJwt = encodeURIComponent(jwt);
    const socketUrl = `http://localhost:8080/ws?jwt=${encodedJwt}`;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
        setClient(stompClient);
        stompClient.subscribe(`/user/${userEmail}/queue/messages`, (message) => {
          const msg = JSON.parse(message.body);
          console.log("📩 Received message:", msg);
          dispatch(receiveMessage(msg)); // ✅ Dispatch to Redux
        });
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        setClient(null);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [userEmail, dispatch]);

  return (
    <WebSocketContext.Provider value={{ stompClient: client, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
