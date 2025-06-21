import axios from "axios";
import {
    GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS,
    LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,
    SEARCH_USER_FAILURE,
    SEARCH_USER_REQUEST,
    SEARCH_USER_SUCCESS,
    FETCH_USER_BY_ID_REQUEST,
    FETCH_USER_BY_ID_SUCCESS,
    FETCH_USER_BY_ID_FAILURE
} from "./ActionType";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const register = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/auth/signup`, userData, {
            headers: { "Content-Type": "application/json" } // CORS fix
        });

        const user = response.data;
        // console.log("User registered:", user);

        dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
        localStorage.setItem("jwt", user.jwt);
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        dispatch({ type: REGISTER_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

export const login = (userData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    const baseURL = import.meta.env.VITE_BACKEND_URL;
    // console.log(userData.data);

    try {
        const response = await axios.post(`${baseURL}/auth/signin`, userData.data);
        // console.log("Response from server:", response.data); // 🔍 Debugging

        const user = response.data;

        if (user.jwt) {
            dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
            dispatch(getUser(user.jwt));
            localStorage.setItem("jwt", user.jwt);
            userData.navigate("/home")
            // console.log("JWT stored in localStorage:", user.jwt); // 🟢 Check if stored
        } else {
            console.log("No JWT token received!"); // 🛑 Debugging
        }
    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error.message });
        console.log("Login error:", error);
    }
};



export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        const user = response.data;
        // console.log("Fetched user:", user);

        dispatch({ type: GET_USER_SUCCESS, payload: user });
    } catch (error) {
        console.error("Get User Error:", error.response?.data || error.message);
        dispatch({ type: GET_USER_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

export const logout = () => (dispatch) => {
    localStorage.clear()
    dispatch({ type: LOGOUT })
}

export const searchUsers = (query, jwt) => async (dispatch) => {
    dispatch({ type: SEARCH_USER_REQUEST });
    try {
        const response = await axios.get(`${baseURL}/api/users/search?query=${query}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });

        dispatch({ type: SEARCH_USER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: SEARCH_USER_FAILURE,
            payload: error.response?.data?.message || error.message
        });
    }
};

export const fetchUserById = (userId, jwt) => async (dispatch) => {
    dispatch({ type: FETCH_USER_BY_ID_REQUEST });
    try {
        const res = await axios.get(`${baseURL}/api/users/get`, {
            params: { userId },
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: FETCH_USER_BY_ID_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: FETCH_USER_BY_ID_FAILURE, payload: error.message });
    }
};



