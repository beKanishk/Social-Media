import {
    FETCH_COMMENTS_REQUEST,
    FETCH_COMMENTS_SUCCESS,
    FETCH_COMMENTS_FAILURE,
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAILURE,
} from './ActionType';
import { DELETE_COMMENT_FAILURE, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS } from './ActionType';

const initialState = {
    loading: false,
    error: null,
    commentsByPost: {}, // { postId: [comments] }
};

const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COMMENTS_REQUEST:
        case CREATE_COMMENT_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_COMMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                commentsByPost: {
                    ...state.commentsByPost,
                    [action.payload.postId]: action.payload.comments,
                },
            };

        case FETCH_COMMENTS_FAILURE:
        case CREATE_COMMENT_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CREATE_COMMENT_SUCCESS:
            return { ...state, loading: false }; // Optionally handle UI state

        case DELETE_COMMENT_REQUEST:
            return { ...state, loading: true, error: null };

        case DELETE_COMMENT_SUCCESS: {
            const { postId, commentId } = action.payload;
            const updatedComments = state.commentsByPost[postId]?.filter(c => c.id !== commentId) || [];
            return {
                ...state,
                loading: false,
                commentsByPost: {
                    ...state.commentsByPost,
                    [postId]: updatedComments,
                },
            };
        }

        case DELETE_COMMENT_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default commentReducer;
