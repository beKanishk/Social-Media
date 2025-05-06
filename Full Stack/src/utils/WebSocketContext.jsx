import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { createContext, useEffect, useRef } from "react";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children, userEmail }) => {
  const stompClient = useRef(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    // IMPORTANT: Pass token as query param, since SockJS does NOT support custom headers
    const socketUrl = "http://localhost:8080/ws?jwt=" + jwt;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl), // Updated line
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        // Subscribe to user's private message queue
        client.subscribe(`/user/${userEmail}/queue/messages`, (message) => {
          const msg = JSON.parse(message.body);
          console.log("Private message received:", msg);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userEmail]);

  return (
    <WebSocketContext.Provider value={{ stompClient: stompClient.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
