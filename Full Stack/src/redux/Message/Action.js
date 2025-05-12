import { LOAD_MESSAGES, RECEIVE_MESSAGE, SET_MESSAGES } from "./ActionType";

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