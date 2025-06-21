import {
  LOAD_MESSAGES,
  MARK_MESSAGES_AS_READ,
  RECEIVE_MESSAGE,
  SET_MESSAGES,
  SET_UNREAD_MESSAGES, // ✅ new
} from "./ActionType";

const initialState = {
  messages: [],
  unreadMessages: [], // ✅ new state
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
        // Optionally update unreadMessages count as well
        unreadMessages: state.unreadMessages.map((u) =>
          u.senderId === action.payload ? { ...u, unreadCount: 0 } : u
        ),
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        // Optionally increment unread count if message is not from self
        unreadMessages: action.payload.receiverId !== state?.currentUserId
          ? updateUnreadList(state.unreadMessages, action.payload.senderId)
          : state.unreadMessages,
      };

    // ✅ NEW: store unreadMessages array
    case SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessages: action.payload,
      };

    default:
      return state;
  }
};

// Helper to update unread list on RECEIVE_MESSAGE
function updateUnreadList(list, senderId) {
  const existing = list.find((u) => u.senderId === senderId);
  if (existing) {
    return list.map((u) =>
      u.senderId === senderId ? { ...u, unreadCount: u.unreadCount + 1 } : u
    );
  } else {
    return [...list, { senderId, unreadCount: 1 }];
  }
}

export default messageReducer;
