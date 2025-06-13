import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import postReducer from "./Post/Reducer";
import followReducer from "./Follower/Reducer";
import commentReducer from "./Comment/Reducer";
import userProfile from "./User/Reducer";
import messageReducer from "./Message/Reducer";
import likeReducer from "./Likes/Reducer";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  follow: followReducer,
  comments: commentReducer,
  userProfile: userProfile,
  message: messageReducer,
  like: likeReducer,
});

// Create the store
const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// Export the store correctly
export default store; // ✅ this is the correct way
