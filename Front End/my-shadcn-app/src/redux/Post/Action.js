import axios from 'axios';
import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
} from './ActionType';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchPosts = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_REQUEST });
  try {
    const response = await axios.get(`${API_URL}/api/post/getall` ,{
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    // console.log(response.data);
    
    dispatch({ type: FETCH_POSTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

// export const createPost = (postData) => async (dispatch) => {
//   dispatch({ type: CREATE_POST_REQUEST });
//   try {
//     const response = await axios.post(API_URL, postData);
//     dispatch({ type: CREATE_POST_SUCCESS, payload: response.data });
//   } catch (error) {
//     dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
//   }
// };

export const createPost = (formData, jwt) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });

  try {
    const url = `${API_URL}/api/post/create`; // ❌ removed ?content=
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: CREATE_POST_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error("Post creation failed:", error);
    dispatch({
      type: CREATE_POST_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};




export const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    await axios.delete(`${API_URL}/api/post/delete/${postId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const fetchPostById = (postId, jwt) => async (dispatch) => {
  dispatch({ type: FETCH_POST_REQUEST });
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/get`, {
      params: { postId },
      headers: { Authorization: `Bearer ${jwt}` },
    });
    dispatch({ type: FETCH_POST_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: FETCH_POST_FAILURE, payload: error.message });
  }
};
