import axios from 'axios';
import {
  FETCH_COMMENTS_REQUEST,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
} from './ActionType';
import { DELETE_COMMENT_FAILURE, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS } from './ActionType';

const BASEURL = import.meta.env.VITE_BACKEND_URL;
// Fetch Comments for a specific post
export const fetchComments = (postId) => async (dispatch) => {
  dispatch({ type: FETCH_COMMENTS_REQUEST });
  try {
    const response = await axios.get(`${BASEURL}/api/comment/get/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    });
    dispatch({ type: FETCH_COMMENTS_SUCCESS, payload: { postId, comments: response.data } });
  } catch (error) {
    dispatch({ type: FETCH_COMMENTS_FAILURE, payload: error.message });
  }
};

// Create a new comment
export const createComment = (postId, message) => async (dispatch) => {
    console.log('Post ID:', postId);  // Log postId
    console.log('Message:', message);  // Log message
    
    dispatch({ type: CREATE_COMMENT_REQUEST });
    try {
        const payload = { message, postId };
        console.log('Payload sent:', payload);  // Log the payload before sending it
        
        await axios.post(`${BASEURL}/api/comment/create`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });

        dispatch({ type: CREATE_COMMENT_SUCCESS });
        // Optionally refetch comments
        dispatch(fetchComments(postId));
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);  // Log the error response
        dispatch({ type: CREATE_COMMENT_FAILURE, payload: error.message });
    }
};


export const deleteComment = (commentId, postId) => async (dispatch) => {
    dispatch({ type: DELETE_COMMENT_REQUEST });
    try {
      await axios.delete(`${BASEURL}/api/comment/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      });
      dispatch({ type: DELETE_COMMENT_SUCCESS, payload: { commentId, postId } });
    } catch (error) {
      dispatch({ type: DELETE_COMMENT_FAILURE, payload: error.message });
    }
  };
  
