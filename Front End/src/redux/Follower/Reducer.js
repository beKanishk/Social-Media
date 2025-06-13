// src/redux/Follow/Reducer.js
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
    ADD_CHAT_USER,
  } from "./ActionType";
  
  const initialState = {
    posts: [],
    followers: [],
    following: [],
    loading: false,
    error: null,
    followActionStatus: null,
    chatUsers: [],
  };
  
  const followReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_FOLLOWER_REQUEST:
      case CREATE_FOLLOWER_REQUEST:
        return { ...state, loading: true, error: null };
  
      case GET_FOLLOWER_SUCCESS:
        return {
          ...state,
          loading: false,
          followers: action.payload.followers,
          following: action.payload.following,
        };
  
      case CREATE_FOLLOWER_SUCCESS:
          return { ...state, loading: false, following: action.payload };
        
      case ADD_CHAT_USER:
        const alreadyExists = state.chatUsers.find(u => u.id === action.payload.id);
        if (alreadyExists) return state;
        return {
          ...state,
          chatUsers: [...state.chatUsers, action.payload],
        };

      case GET_FOLLOWER_FAILURE:
      case CREATE_FOLLOWER_FAILURE:
        return { ...state, loading: false, error: action.payload };

      case FETCH_FOLLOWING_POSTS_REQUEST:
        return { ...state, loading: true };
      
      case FETCH_FOLLOWING_POSTS_SUCCESS:
        return { ...state, loading: false, posts: action.payload };
      
      case FETCH_FOLLOWING_POSTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default followReducer;
  