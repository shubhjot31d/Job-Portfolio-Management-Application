import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_RPROFILE,
    RPROFILE_ERROR,
    CLEAR_RPROFILE
} from './types';

// get current recruiter profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/rprofile/me');
        dispatch({
            type: GET_RPROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: RPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// update recruiter profile
export const createProfile = (formData, history) => async dispatch => {
    const config = {
        'headers': {
            'Content-Type': 'application/json',
        }
    };
    try {
        const res = await axios.post('/api/rprofile', formData, config);
        dispatch({
            type: GET_RPROFILE,
            payload: res.data
        });
        dispatch(setAlert("Profile Created", "success"));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: RPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// clear profile 
export const clearRprofile = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_RPROFILE });
    } catch (err) {
        dispatch({
            type: RPROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};