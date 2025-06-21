import { GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS } from "./ActionType";
import { EDIT_USER_PROFILE_REQUEST, EDIT_USER_PROFILE_SUCCESS, EDIT_USER_PROFILE_FAILURE } from "./ActionType";
import { CLEAR_USER_PROFILE_REQUEST, CLEAR_USER_PROFILE_SUCCESS, CLEAR_USER_PROFILE_FAILURE } from "./ActionType";

  const initialState = {
    userProfile: null,
    loading: false,
    error: null,
  };
  
  const userProfile = (state = initialState, action) => {
    switch (action.type) {
      case GET_USER_PROFILE_REQUEST:
        return { ...state, loading: true, error: null };
      case GET_USER_PROFILE_SUCCESS:
        return { ...state, loading: false, userProfile: action.payload };
      case GET_USER_PROFILE_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case EDIT_USER_PROFILE_REQUEST:
        return { ...state, loading: true, error: null };
      case EDIT_USER_PROFILE_SUCCESS:
        return { ...state, loading: false, userProfile: action.payload };
      case EDIT_USER_PROFILE_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case CLEAR_USER_PROFILE_REQUEST:
        return { ...state, loading: true, error: null };
      case CLEAR_USER_PROFILE_SUCCESS:
        return { ...state, loading: false, userProfile: action.payload };
      case CLEAR_USER_PROFILE_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default userProfile;
  