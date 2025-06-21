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

const initialState = {
  posts: [],
  loading: false,
  error: null,
  singlePost: null,
  singlePostLoading: false,
  singlePostError: null,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case CREATE_POST_REQUEST:
    case DELETE_POST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload };
    case CREATE_POST_SUCCESS:
      return { ...state, loading: false, posts: [action.payload, ...state.posts] };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case FETCH_POSTS_FAILURE:
    case CREATE_POST_FAILURE:
    case DELETE_POST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_POST_REQUEST:
      return { ...state, singlePostLoading: true, singlePostError: null };
    case FETCH_POST_SUCCESS:
      return { ...state, singlePost: action.payload, singlePostLoading: false };
    case FETCH_POST_FAILURE:
      return { ...state, singlePostError: action.payload, singlePostLoading: false };
    default:
      return state;
  }
};

export default postReducer;
