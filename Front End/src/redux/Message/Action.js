import { LOAD_MESSAGES, MARK_MESSAGES_AS_READ, RECEIVE_MESSAGE, SET_MESSAGES } from "./ActionType";
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

  // export const markMessagesAsRead = (senderId) => async (dispatch) => {
  //   const jwt = localStorage.getItem("jwt");
  //   try {
  //     await axios.put(
  //       `http://localhost:8080/api/chat/mark-read/${senderId}`,
  //       {},
  //       { headers: { Authorization: `Bearer ${jwt}` } }
  //     );
  //     // Optionally: refetch messages or update read status in state
  //   } catch (err) {
  //     console.error("Failed to mark messages as read:", err);
  //   }
  // };

  export const markMessagesAsRead = (senderId) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  try {
    await axios.put(
      `http://localhost:8080/api/chat/mark-read/${senderId}`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    dispatch({ type: MARK_MESSAGES_AS_READ, payload: senderId });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
};
