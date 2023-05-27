import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMadeJobs, deleteJob } from '../../actions/job';
import Moment from 'react-moment';
import Spinner from '../layout/Spinner';

const RecJobListing = ({ getMadeJobs, deleteJob, job: { jobs, loading } }) => {
    useEffect(() => {
        getMadeJobs();
    }, [getMadeJobs]);
    return (
        <Fragment>
            {loading ? <Spinner /> : (
                <Fragment>
                    <h1 className="text-center heading" >Jobs and Applications</h1>
                    {jobs.length > 0 ? (
                        <Fragment>
                            {jobs.map(job => (
                                <div className="container bg-light m-1 border border-success">
                                    <Link to={`/job-applicants/${job._id}`}><h3 className="job-title title"> {job.title}</h3></Link>
                                    <p className="m-0"><span className="field">Salary</span> : <span className="title"> {job.salary}</span></p>
                                    <p className="m-0"><span className="field">Date of Posting </span>: <span className="title"><Moment format="YYYY/MM/DD">{job.date}</Moment></span></p>
                                    <p className="m-0"> <span className="field">Duration</span> : {job.duration === '0' ? (<span className="title"> Indefinite</span>) : (<span className="title"> {job.duration} Month</span>)}</p>
                                    <p className="m-0"><span className="field">Deadline</span> : <span className="title"><Moment format="YYYY/MM/DD">{job.deadline}</Moment></span></p>
                                    <p className="m-0"><span className="field">Number of Applicants </span>: <span className="title"> {job.applications.filter(app => app.reject === false).length}</span></p>
                                    <p className="m-0"><span className="field">Maximum of Applications </span>: <span className="title"> {job.maxap.application}</span></p>
                                    <p className="m-0"><span className="field">Maximum of Positions </span>: <span className="title"> {job.maxap.position}</span></p>
                                    <Link to={`/edit-job/${job._id}`} className="btn btn-dark m-1 login">Edit job</Link>
                                    <Link onClick={() => deleteJob(job._id)} className="btn btn-danger m-1 login">Delete Job</Link>
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

RecJobListing.propTypes = {
    getMadeJobs: PropTypes.func.isRequired,
    deleteJob: PropTypes.func.isRequired,
    job: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    job: state.job
});

export default connect(mapStateToProps, { getMadeJobs, deleteJob })(RecJobListing);
