import axios from "axios";
import { GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS, EDIT_USER_PROFILE_REQUEST, EDIT_USER_PROFILE_SUCCESS, EDIT_USER_PROFILE_FAILURE, CLEAR_USER_PROFILE_REQUEST, CLEAR_USER_PROFILE_SUCCESS, CLEAR_USER_PROFILE_FAILURE, CLEAR_USER_PROFILE_STATE } from "./ActionType";

  
const baseURL = import.meta.env.VITE_BACKEND_URL;
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

export const editUserProfile = (userDetailsDTO, image) => async (dispatch) => {
    dispatch({ type: EDIT_USER_PROFILE_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const formData = new FormData();
        // Append userDetailsDTO fields to formData
        Object.keys(userDetailsDTO).forEach(key => {
            formData.append(key, userDetailsDTO[key]);
        });
        if (image) {
            formData.append("image", image);
        }
        const response = await axios.put(
            `${baseURL}/api/users/update`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        dispatch({
            type: EDIT_USER_PROFILE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: EDIT_USER_PROFILE_FAILURE,
            payload: error.response?.data?.message || "Failed to update user profile",
        });
    }
};

export const clearUserProfile = (userDetailsDTO = {}, clearImage = false) => async (dispatch) => {
    dispatch({ type: CLEAR_USER_PROFILE_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.put(
            `${baseURL}/api/users/clear?clearImage=${clearImage}`,
            userDetailsDTO,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        dispatch({
            type: CLEAR_USER_PROFILE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: CLEAR_USER_PROFILE_FAILURE,
            payload: error.response?.data?.message || "Failed to clear user profile",
        });
    }
};

// New action creator for clearing only the Redux state
export const clearUserProfileState = () => (dispatch) => {
    dispatch({ type: CLEAR_USER_PROFILE_STATE });
};