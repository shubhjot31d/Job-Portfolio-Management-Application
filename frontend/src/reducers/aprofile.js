import {
    GET_APROFILE,
    GET_APROFILES,
    SORT_APROFILES,
    APROFILE_ERROR,
    CLEAR_APROFILE,
    SORT_SELECTED_APROFILES
} from '../actions/types';

const initialState = {
    aprofile: null,
    aprofiles: [],
    errors: {},
    loading: true
};

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {

        case GET_APROFILE:
            return {
                ...state,
                aprofile: payload,
                loading: false
            };

        case CLEAR_APROFILE:
            return {
                ...state,
                aprofile: null,
                aprofiles: [],
                loading: false
            };

        case GET_APROFILES:
            return {
                ...state,
                aprofiles: payload,
                loading: false
            };

        case SORT_APROFILES:
            return {
                ...state,
                aprofiles: state.aprofiles.sort(function (a, b) {
                    if (payload.att === "name") {
                        var aname = a.user.name.toUpperCase();
                        var bname = b.user.name.toUpperCase();
                        if (aname > bname) {
                            return (payload.n) * 1
                        }
                        if (bname > aname) {
                            return (payload.n) * (-1)
                        }
                        return 0
                    }
                    if (payload.att === "date") {
                        const datea = a.applications.filter(app => app.job === payload.jobId).dateofapplication;
                        const dateb = b.applications.filter(app => app.job === payload.jobId).dateofapplication;

                        return (payload.n) * (datea - dateb)
                    }
                    if (payload.att === "rating") {
                        return (payload.n) * (parseInt(a.rating) - parseInt(b.rating))
                    }

                }),
                loading: false
            };

        case SORT_SELECTED_APROFILES:
            return {
                ...state,
                aprofiles: state.aprofiles.sort(function (a, b) {
                    if (payload.att === "name") {
                        var aname = a.user.name.toUpperCase();
                        var bname = b.user.name.toUpperCase();
                        if (aname > bname) {
                            return (payload.n) * 1
                        }
                        if (bname > aname) {
                            return (payload.n) * (-1)
                        }
                        return 0
                    }
                    if (payload.att === "date") {
                        const datea = a.applications.filter(app => app.accepted === true).dateofjoining;
                        const dateb = b.applications.filter(app => app.accepted === true).dateofjoining;

                        return (payload.n) * (datea - dateb)
                    }
                    if (payload.att === "rating") {
                        return (payload.n) * (parseInt(a.rating) - parseInt(b.rating))
                    }
                    if (payload.att === "title") {
                        var atitle = a.applications.filter(app => app.accepted === true).job.title.toUpperCase();
                        var btitle = b.applications.filter(app => app.accepted === true).job.title.toUpperCase();
                        if (atitle > btitle) {
                            return (payload.n) * 1
                        }
                        if (btitle > atitle) {
                            return (payload.n) * (-1)
                        }
                        return 0
                    }
                }),
                loading: false
            };


        case APROFILE_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false
            }

        default:
            return state;
    }
}