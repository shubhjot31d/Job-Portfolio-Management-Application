import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { getAppliedJobs } from '../../actions/job';
import RateJob from './RateJob';
import Spinner from '../layout/Spinner';

const MyApplications = ({ getAppliedJobs, job: { jobs, loading }, aprofile: { aprofile } }) => {
    useEffect(() => {
        getAppliedJobs();
    }, [getAppliedJobs]);
    return (
        <Fragment>
            {loading ? <Spinner /> : (
                <Fragment>
                    <h1 className="text-center heading">My Applications</h1>
                    {jobs.length > 0 ? (
                        <Fragment>
                            {jobs.map(job => (
                                <div className="container bg-light m-1 border border-success">
                                    <h3 className="job-title title">{job.title}</h3>
                                    <p className="m-0"><span className="field">Recruiter Name</span> : <span className="title"> {job.user.name}</span></p>
                                    <p className="m-0"><span className="field">Rating</span> :<span className="title"> {job.rating}</span></p>
                                    <p className="m-0"><span className="field">Salary</span> : <span className="title"> {job.salary}</span></p>
                                    <p className="m-0"> <span className="field">Duration</span> : {job.duration === '0' ? (<span className="title"> Indefinite</span>) : (<span className="title"> {job.duration}</span>)}</p>
                                    <p className="m-0"><span className="field">Deadline</span> : <span className="title"><Moment format="YYYY/MM/DD">{job.deadline}</Moment></span></p>
                                    {aprofile.applications.map(app => app.job === job._id && <Fragment>
                                        {app.rejected === false && app.shortlisted === false && app.accepted === false && <Fragment>
                                            <p className="m-0"><span className="field">Status</span> : <span className="title"> Pending</span></p>
                                        </Fragment>}
                                        {app.rejected === true && app.shortlisted === false && app.accepted === false && <Fragment>
                                            <p className="m-0"><span className="field">Status</span> : <span className="title"> Rejected</span></p>
                                        </Fragment>}
                                        {app.rejected === false && app.shortlisted === true && app.accepted === false && <Fragment>
                                            <p className="m-0"><span className="field">Status</span> : <span className="title"> Shortlisted</span></p>
                                        </Fragment>}
                                        {app.rejected === false && app.shortlisted === false && app.accepted === true && <Fragment>
                                            <p className="m-0"><span className="field">Status</span> :<span className="title"> Accepted</span></p>
                                            <p><span className="field">Date of Joining</span> : <span className="title"><Moment format="YYYY/MM/DD">{app.dateofjoining}</Moment></span> </p>
                                            {/* Rate the Job */}
                                            <RateJob JobId={job._id} />
                                        </Fragment>}
                                    </Fragment>)}
                                </div>
                            ))}
                        </Fragment>
                    ) : (
                            <Fragment>
                                <h2>No Applied Jobs</h2>
                            </Fragment>
                        )}
                </Fragment>
            )}
        </Fragment>
    )
};

MyApplications.propTypes = {
    getAppliedJobs: PropTypes.func.isRequired,
    job: PropTypes.object.isRequired,
    aprofile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    job: state.job,
    aprofile: state.aprofile
});

export default connect(mapStateToProps, { getAppliedJobs })(MyApplications);
