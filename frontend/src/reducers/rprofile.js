import {
    GET_RPROFILE,
    RPROFILE_ERROR,
    CLEAR_RPROFILE
} from '../actions/types';

const initialState = {
    rprofile: null,
    errors: {},
    loading: true
};

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {

        case GET_RPROFILE:
            return {
                ...state,
                rprofile: payload,
                loading: false
            };

        case CLEAR_RPROFILE:
            return {
                ...state,
                rprofile: null,
                loading: false
            };

        case RPROFILE_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false
            }

        default:
            return state;
    }
}