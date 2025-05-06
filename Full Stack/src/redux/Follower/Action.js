// src/redux/Follow/Action.js
import axios from "axios";
import {
    GET_FOLLOWER_REQUEST,
    GET_FOLLOWER_SUCCESS,
    GET_FOLLOWER_FAILURE,
    CREATE_FOLLOWER_REQUEST,
    CREATE_FOLLOWER_SUCCESS,
    CREATE_FOLLOWER_FAILURE,
    FETCH_FOLLOWING_POSTS_REQUEST,
    FETCH_FOLLOWING_POSTS_SUCCESS,
    FETCH_FOLLOWING_POSTS_FAILURE,
} from "./ActionType";

const BASE_URL = "http://localhost:8080"; 

export const getFollowersAndFollowing = (jwt) => async (dispatch) => {
    dispatch({ type: GET_FOLLOWER_REQUEST });

    try {
        const followersResponse = await axios.get(`${BASE_URL}/api/follower/getfollowers`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        const followingResponse = await axios.get(`${BASE_URL}/api/follower/getfollowing`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({
            type: GET_FOLLOWER_SUCCESS,
            payload: {
                followers: followersResponse.data,
                following: followingResponse.data,
            },
        });
    } catch (error) {
        dispatch({
            type: GET_FOLLOWER_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const createFollower = (userName, jwt) => async (dispatch, getState) => {
    dispatch({ type: CREATE_FOLLOWER_REQUEST });
  
    try {
      const response = await axios.get(
        `http://localhost:8080/api/follower/create/${userName}`,{
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );
  
      const message = response.data;
  
      // Optimistically update following list
      const { following } = getState().follow;
      let updatedFollowing;
  
      if (message.includes("Unfollowed")) {
        updatedFollowing = following.filter(user => user.userName !== userName);
      } else {
        const newUser = { userName }; // Add more info if available
        updatedFollowing = [...following, newUser];
      }
      console.log(updatedFollowing);
      
      dispatch({ type: CREATE_FOLLOWER_SUCCESS, payload: updatedFollowing });
    //   dispatch(getUser(jwt));
    } catch (error) {
      dispatch({
        type: CREATE_FOLLOWER_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  export const fetchFollowingPosts = (jwt) => async (dispatch) => {
    dispatch({ type: FETCH_FOLLOWING_POSTS_REQUEST });
  
    try {
      const response = await axios.get("http://localhost:8080/api/post/followerpost", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      // console.log("Follower Post",response.data);
      
      dispatch({ type: FETCH_FOLLOWING_POSTS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({
        type: FETCH_FOLLOWING_POSTS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  