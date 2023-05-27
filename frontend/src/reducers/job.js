import {
    GET_JOBS,
    JOB_ERROR,
    CLEAR_JOBS,
    SEARCH_JOBS,
    SORT_JOBS,
    FILTER_JOBS,
    APPLY_JOB,
    EDIT_JOB,
    DELETE_JOB,
    GET_JOB
} from '../actions/types';

const initialState = {
    job: null,
    jobs: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_JOBS:
            return {
                ...state,
                jobs: payload,
                loading: false
            };

        case GET_JOB:
            return {
                ...state,
                job: payload,
                loading: false
            };

        case CLEAR_JOBS:
            return {
                ...state,
                job: null,
                jobs: [],
                loading: false
            };

        case SEARCH_JOBS:
            return {
                ...state,
                jobs: payload.jobs.filter(job => job.title === payload.search),
                loading: false
            };

        case SORT_JOBS:
            return {
                ...state,
                jobs: state.jobs.sort(function (a, b) {
                    if (payload.att === "salary") {
                        return (payload.n) * (parseInt(a.salary) - parseInt(b.salary))
                    }
                    if (payload.att === "duration") {
                        return (payload.n) * (parseInt(a.duration) - parseInt(b.duration))
                    }
                    if (payload.att === "rating") {
                        return (payload.n) * (parseInt(a.rating) - parseInt(b.rating))
                    }

                }),
                loading: false
            };

        case FILTER_JOBS:
            return {
                ...state,
                jobs: state.jobs.filter(function (job) {
                    if (payload.lsalary === '') {
                        payload.lsalary = '0'
                    }
                    if (payload.usalary === '') {
                        payload.usalary = '1000000000'
                    }
                    if (payload.typeofjob === '') {
                        return parseInt(job.duration) < parseInt(payload.duration) && parseInt(job.salary) >= parseInt(payload.lsalary) && parseInt(job.salary) <= parseInt(payload.usalary)
                    }
                    else {
                        return job.typeofjob === payload.typeofjob && parseInt(job.duration) < parseInt(payload.duration) && parseInt(job.salary) >= parseInt(payload.lsalary) && parseInt(job.salary) <= parseInt(payload.usalary)
                    }
                }),
                loading: false
            };

        case APPLY_JOB:
            return {
                ...state,
                jobs: state.jobs.map(job => job._id === payload.id ? { ...job, applications: payload.applications } : job),
                loading: false
            };

        case EDIT_JOB:
            return {
                ...state,
                jobs: state.jobs.map(job => job._id === payload.id ? { job: payload.job } : job),
                loading: false
            };

        case DELETE_JOB:
            return {
                ...state,
                jobs: state.jobs.filter(job => job._id !== payload),
                loading: false
            }

        case JOB_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };

        default:
            return state;
    }
};