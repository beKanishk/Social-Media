import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_REQUEST, GET_USER_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, GET_USER_FAILURE, GET_USER_SUCCESS, LOGOUT, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, SEARCH_USER_FAILURE, GET_USER_PROFILE_REQUEST, GET_USER_PROFILE_SUCCESS, GET_USER_PROFILE_FAILURE } from "./ActionType"

const initialState = {
    user:null,
    results: [],
    loading:false,
    error:null,
    jwt:null,
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case SEARCH_USER_REQUEST:
            return {...state, loading:true, error:null}
        
            case REGISTER_SUCCESS:
            case LOGIN_SUCCESS:
                return {...state, loading:false, error: null, jwt:action.payload}
            
            case GET_USER_SUCCESS:
                return {...state, loading:false, user:action.payload, error:null}

            case SEARCH_USER_SUCCESS:
                return { ...state, loading: false, results: action.payload };    

            case REGISTER_FAILURE:
            case LOGIN_FAILURE:
            case GET_USER_FAILURE:
            case SEARCH_USER_FAILURE:
                return {...state, loading: false, error:action.payload}
            // case GET_USER_PROFILE_REQUEST:
            //     return { ...state, loading: true, error: null };
            
            // case GET_USER_PROFILE_SUCCESS:
            //     return { ...state, loading: false, userProfile: action.payload, error: null };
        
            // case GET_USER_PROFILE_FAILURE:
            //     return { ...state, loading: false, error: action.payload };

            case LOGOUT:{
                return initialState
            }    
            default:
                return state
    }
}

export default authReducer