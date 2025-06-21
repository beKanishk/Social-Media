import { LOAD_MESSAGES, MARK_MESSAGES_AS_READ, RECEIVE_MESSAGE, SET_MESSAGES, SET_UNREAD_MESSAGES } from "./ActionType";
import axios from "axios";
export const receiveMessage = (message) => ({
    type: RECEIVE_MESSAGE,
    payload: message,
  });
  
  export const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    payload: messages,
  });

  export const setMessages = (messages) => ({
    type: SET_MESSAGES,
    payload: messages,
  });

  export const sendMessage = (message) => ({
    type: RECEIVE_MESSAGE, 
    payload: message,
  });

  export const markMessagesAsRead = (senderId) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/mark-read/${senderId}`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    dispatch({ type: MARK_MESSAGES_AS_READ, payload: senderId });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
};

// redux/Message/Action.js
export const fetchUnreadMessages = () => async (dispatch) => {
  try {
    const jwt = localStorage.getItem("jwt");
    // const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/unread`, {
    //   headers: { Authorization: `Bearer ${jwt}` },
    // });
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/unread`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    dispatch({ type: SET_UNREAD_MESSAGES, payload: res.data });
  } catch (error) {
    console.error("Failed to fetch unread messages", error);
  }
};

