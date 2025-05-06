import axios from 'axios';
import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
} from './ActionType';

const API_URL = 'http://localhost:8080/api/post';

export const fetchPosts = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_REQUEST });
  try {
    const response = await axios.get(`${API_URL}/getall` ,{
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    console.log(response.data);
    
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
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(response.data);
    
    dispatch({ type: CREATE_POST_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Post creation failed:", error);
    dispatch({
      type: CREATE_POST_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
