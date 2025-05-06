import { GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS } from "./ActionType";

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
      default:
        return state;
    }
  };
  
  export default userProfile;
  