// redux/message/reducer.js
import { LOAD_MESSAGES, RECEIVE_MESSAGE, SET_MESSAGES } from "./ActionType";

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
