import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_REQUEST, GET_USER_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, GET_USER_FAILURE, GET_USER_SUCCESS, LOGOUT, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, SEARCH_USER_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_FAILURE, FETCH_USER_BY_ID_REQUEST, FETCH_USER_BY_ID_SUCCESS, FETCH_USER_BY_ID_FAILURE } from "./ActionType"

const initialState = {
    user:null,
    results: [],
    loading:false,
    loginLoading: false,
    error:null,
    jwt:null,
    singleUser: null,
    singleUserLoading: false,
    singleUserError: null,
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case REGISTER_REQUEST:
        case GET_USER_REQUEST:
        case SEARCH_USER_REQUEST:
            return {...state, loading:true, error:null}
        
        case LOGIN_REQUEST:
            return { ...state, loginLoading: true, error: null };
        
        case REGISTER_SUCCESS:
            return {...state, loading:false, error: null, jwt:action.payload}
        
        case LOGIN_SUCCESS:
            return {...state, loginLoading:false, error: null, jwt:action.payload}
            
            case GET_USER_SUCCESS:
                return {...state, loading:false, user:action.payload, error:null}

            case SEARCH_USER_SUCCESS:
                return { ...state, loading: false, results: action.payload };    

            case REGISTER_FAILURE:
            case GET_USER_FAILURE:
            case SEARCH_USER_FAILURE:
                return {...state, loading: false, error:action.payload}
            
            case LOGIN_FAILURE:
                return { ...state, loginLoading: false, error: action.payload };

            case LOGOUT:{
                return initialState
            }    

            case FETCH_USER_BY_ID_REQUEST:
                return { ...state, singleUserLoading: true, singleUserError: null };
            case FETCH_USER_BY_ID_SUCCESS:
                return { ...state, singleUser: action.payload, singleUserLoading: false };
            case FETCH_USER_BY_ID_FAILURE:
                return { ...state, singleUserError: action.payload, singleUserLoading: false };

            default:
                return state
    }
}

export default authReducer