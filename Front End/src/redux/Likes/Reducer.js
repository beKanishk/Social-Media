import { SET_LIKES, TOGGLE_LIKE } from "./ActionType";

const initialState = {
  postLikes: {}, // postId -> likes[]
};

const likeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIKES:
      return {
        ...state,
        postLikes: {
          ...state.postLikes,
          [action.payload.postId]: action.payload.likes,
        },
      };

    case TOGGLE_LIKE: {
      const { postId, userId } = action.payload;
      const currentLikes = state.postLikes[postId] || [];
      console.log("Current likes :",currentLikes);
      
      const hasLiked = currentLikes.some((like) => like.user?.id === userId);
      const updatedLikes = hasLiked
        ? currentLikes.filter((like) => like.user?.id !== userId) // Remove like
        : [...currentLikes, { user: { id: userId } }]; // Add like (simplified user)

      return {
        ...state,
        postLikes: {
          ...state.postLikes,
          [postId]: updatedLikes,
        },
      };
    }

    default:
      return state;
  }
};

export default likeReducer;
