import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/aprofile';
import Spinner from '../layout/Spinner';
import Moment from 'react-moment';

const Applicant = ({ getCurrentProfile, aprofile: { aprofile, loading }, auth: { user } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && aprofile === null ? (
        <Spinner />
    ) : (
            <Fragment>
                <h1 className="heading text-center">Dashboard</h1>
                <p className="text-center title"><i className="fa fa-user"></i>Welcome {user && user.name}</p>
                {aprofile === null ? (
                    <Fragment>
                        <p className="login text-center">Kindly complete your profile</p>
                        <div className="text-center login">
                            <Link to="/create-aprofile" className="btn btn-info">
                                Create Profile <i className="fa fa-black-tie"></i>
                            </Link>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            <div className="text-center login">
                                <Link to="/edit-aprofile" className="btn btn-info mb-2 mr-3">
                                    Edit Profile <i className="fa fa-black-tie"></i>
                                </Link>
                                <Link to="/add-education" className="btn btn-warning mb-2 mr-3">
                                    Add Education <i className="fa fa-graduation-cap"></i>
                                </Link>
                                <Link to="/job-listing" className="btn btn-danger mb-2 mr-3">
                                    Job Listing <i className="fa fa-briefcase"></i>
                                </Link>
                                <Link to="/my-application" className="btn btn-dark mb-2 mr-3">
                                    My Applications <i className="fa fa-envelope"></i>
                                </Link>
                            </div>

                            <h2 className="heading text-center">Skills</h2>
                            <ul className="">
                                {aprofile.skills.length > 0 ? (
                                    <Fragment>
                                        {aprofile.skills.map(skill => (
                                            <li className="skill login text-primary medium"><i className="fa fa-thumbs-up"></i> {skill}</li>
                                        ))}
                                    </Fragment>
                                ) : (<Fragment></Fragment>)}

                            </ul>
                            {aprofile.education.length > 0 ? (
                                <Fragment>
                                    <h2 className="heading text-center">Education</h2>
                                    {aprofile.education.map(edu => (<Fragment>
                                        <div className="login education text-info medium">
                                            <i className="fa fa-university"></i>
                                            <p> <i className="fa fa-book"></i> Studied at {edu.school}</p>
                                            <p><i className="fa fa-book"></i> {edu.fieldofstudy}</p>
                                            <p><i className="fa fa-book"></i> From <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
                                    {edu.to === null ? ('Current') : (<Moment format="YYYY/MM/DD">{edu.to}</Moment>)}
                                            </p>
                                        </div>
                                    </Fragment>
                                    ))}
                                </Fragment>
                            ) : (<Fragment></Fragment>)}
                        </Fragment>
                    )
                }
            </Fragment >
        )
};

Applicant.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    aprofile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    aprofile: state.aprofile
});

export default connect(mapStateToProps, { getCurrentProfile })(Applicant);
