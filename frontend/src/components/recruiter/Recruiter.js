import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/rprofile';
import Spinner from '../layout/Spinner';

const Recruiter = ({ getCurrentProfile, rprofile: { loading, rprofile }, auth: { user } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && rprofile === null ? (
        <Spinner />
    ) : (
            <Fragment>
                <h1 className="text-center heading">Dashboard</h1>
                <p className="text-center title"><i className="fa fa-user"></i> Welcome {user && user.name}</p>
                {rprofile === null ? (
                    <Fragment>
                        <p className="text-center login">Kindly complete your profile</p>
                        <div className="text-center login">
                            <Link to="/create-rprofile" className="btn btn-info">
                                <i className="fa fa-user"></i> Create Profile
                        </Link>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            <div className="text-center login">
                                <Link to="/create-rprofile" className="btn btn-info m-2">
                                    <i className="fa fa-user"></i> Edit Profile
                        </Link>
                                <Link to="/add-job" className="btn btn-danger m-2">
                                    <i className="fa fa-briefcase"></i> Add a Job
                            </Link>
                                <Link to="/rec-job-listing" className="btn btn-primary m-2">
                                    <i className="fa fa-folder"></i> Jobs and Applications
                            </Link>
                                <Link to="/selected-applicants" className="btn btn-dark m-2">
                                    <i className="fa fa-envelope"></i> Selected Applicants
                            </Link>
                            </div>
                            <p className="m-2 text-center login"><i className="fa fa-info"> <span className="field"> Contact No. </span>:  <span className="login"> {rprofile.contactno} </span></i></p>
                            <p className="m-2 text-center login"><i className="fa fa-info"></i> <span className="field"> Bio </span>: <span className="login"> {rprofile.bio}</span></p>
                        </Fragment>
                    )}
            </Fragment>
        )
};

Recruiter.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    rprofile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    rprofile: state.rprofile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Recruiter);
