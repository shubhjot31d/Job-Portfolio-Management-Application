import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_APROFILE,
    GET_APROFILES,
    APROFILE_ERROR,
    CLEAR_APROFILE,
    SORT_APROFILES,
    SORT_SELECTED_APROFILES
} from './types';

// get current recruiter profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/aprofile/me');
        dispatch({
            type: GET_APROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
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
        const res = await axios.post('/api/aprofile/skills', formData, config);
        dispatch({
            type: GET_APROFILE,
            payload: res.data
        });
        dispatch(setAlert("Skills Added", "success"));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add education
export const addEducation = (formData, history) => async dispatch => {
    const config = {
        'headers': {
            'Content-Type': 'application/json',
        }
    };
    try {
        const res = await axios.put('/api/aprofile/education', formData, config);
        dispatch({
            type: GET_APROFILE,
            payload: res.data
        });
        dispatch(setAlert("Education Added", "success"));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// clear profile 
export const clearAprofile = () => async dispatch => {
    try {
        dispatch({ type: CLEAR_APROFILE });
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};

// add myapplication
export const addMyapplication = (id, sop) => async dispatch => {
    const config = {
        'headers': {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ id, sop });
    try {
        const res = await axios.put('/api/aprofile/application', body, config);
        dispatch({
            type: GET_APROFILE,
            payload: res.data
        })
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// get all profiles by given job id
export const getProfilesByJobId = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/aprofile/aprofiles/job/${id}`);
        dispatch({
            type: GET_APROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// sort Aprofiles
export const sortAprofiles = (jobId, sort) => async dispatch => {
    const sortArray = sort.split(' ');

    try {
        dispatch({
            type: SORT_APROFILES,
            payload: { jobId, att: sortArray[0], n: parseInt(sortArray[1]) }
        })
    } catch (err) {
        // console.log(err);
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// reject application
export const rejectApplication = (jobId, aprofileId) => async dispatch => {
    try {
        await axios.put(`/api/aprofile/job/reject/${jobId}/${aprofileId}`);
        dispatch(getProfilesByJobId(jobId));
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// shortlist application
export const shortlistApplication = (jobId, aprofileId) => async dispatch => {
    try {
        await axios.put(`/api/aprofile/job/shortlist/${jobId}/${aprofileId}`);
        dispatch(getProfilesByJobId(jobId));
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// accept application
export const acceptApplication = (jobId, aprofileId) => async dispatch => {
    try {
        await axios.put(`/api/aprofile/job/accept/${jobId}/${aprofileId}`);
        dispatch(getProfilesByJobId(jobId));
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// get all profiles accepted by a recruiter
export const getAcceptedProfileByRec = () => async dispatch => {
    try {
        const res = await axios.get('/api/aprofile/aprofiles/recruiter');
        dispatch({
            type: GET_APROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// rate aprofile

export const rateAprofile = (rate, id) => async dispatch => {
    const config = {
        'headers': {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ rate });
    try {
        await axios.put(`/api/aprofile/rate/${id}`, body, config);
        dispatch(getAcceptedProfileByRec());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// sort Aprofiles
export const sortSelectedAprofiles = (sort) => async dispatch => {
    const sortArray = sort.split(' ');

    try {
        dispatch({
            type: SORT_SELECTED_APROFILES,
            payload: { att: sortArray[0], n: parseInt(sortArray[1]) }
        })
    } catch (err) {
        // console.log(err);
        dispatch({
            type: APROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}
