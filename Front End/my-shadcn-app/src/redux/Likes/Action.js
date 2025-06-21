import axios from "axios";
import { SET_LIKES } from "./ActionType";

// Set likes
export const setLikes = (postId, likes) => ({
  type: SET_LIKES,
  payload: { postId, likes },
});

// Fetch likes from backend
export const fetchLikes = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/likes/get/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch(setLikes(postId, res.data));
  } catch (error) {
    console.error("Failed to fetch likes:", error);
  }
};

// Toggle like (then fetch updated list)
export const toggleLike = (postId) => async (dispatch) => {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/likes/create/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    // Fetch latest likes from backend
    dispatch(fetchLikes(postId));
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
};
