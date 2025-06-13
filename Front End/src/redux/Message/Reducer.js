// redux/message/reducer.js
import { LOAD_MESSAGES, MARK_MESSAGES_AS_READ, RECEIVE_MESSAGE, SET_MESSAGES } from "./ActionType";

const initialState = {
  messages: [],
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES:
    case LOAD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case MARK_MESSAGES_AS_READ:
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.senderId === action.payload ? { ...msg, read: true } : msg
        ),
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload], // Append new message
      };

    default:
      return state;
  }
};

export default messageReducer;
