import axios from "axios";
import { GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS } from "./ActionType";

  
const baseURL = "http://localhost:8080";
export const fetchUserProfile = (userId) => async (dispatch) => {
    dispatch({ type: GET_USER_PROFILE_REQUEST });

    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.get(`${baseURL}/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        // console.log("Action userProfile",response.data);
        
        dispatch({
            type: GET_USER_PROFILE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: GET_USER_PROFILE_FAILURE,
            payload: error.response?.data?.message || "Failed to load user profile",
        });
    }
};