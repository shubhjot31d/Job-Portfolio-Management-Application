import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { getJobs } from '../../actions/job';
import { setAlert } from '../../actions/alert';
import Spinner from '../layout/Spinner';
import SearchFeature from '../layout/SearchFeature';
import SortFeature from '../layout/SortFeature';
import FilterFeature from '../layout/FilterFeature';

const JobListing = ({ getJobs, setAlert, job: { loading, jobs }, aprofile: { aprofile } }) => {
    useEffect(() => {
        getJobs();
    }, [getJobs]);

    return (
        <Fragment>
            {loading ? (
                <Fragment>
                    <Spinner />
                </Fragment>
            ) : (
                    <Fragment>
                        <Link onClick={getJobs} to='/job-listing' className="btn btn-primary m-2 login"><i className="fa fa-tag"></i> Job Listing</Link>
                        <h1 className="heading text-center">Job Listing</h1>
                        <SearchFeature />
                        <SortFeature />
                        <FilterFeature />
                        {jobs.length > 0 ? (
                            <Fragment>
                                {jobs.map(job => (
                                    <div className="container bg-light m-1 border border-success">
                                        <h3 className="job-title title">{job.title}</h3>
                                        <p className="m-0"> <span className="field">Recruiter Name </span> :<span className="title"> {job.user.name} </span></p>
                                        <p className="m-0"> <span className="field">Rating </span>: <span className="title"> {job.rating}</span></p>
                                        <p className="m-0"> <span className="field">Salary </span>: <span className="title"> {job.salary}</span></p>
                                        <p className="m-0"> <span className="field">Type Of Job </span>: <span className="title"> {job.typeofjob}</span></p>
                                        <p className="m-0"> <span className="field">Duration </span>: {job.duration === '0' ? (<span className="title"> Indefinite</span>) : (<span className="title"> {job.duration} Month</span>)}</p>
                                        <p className="m-0"> <span className="field">Deadline </span>: <span className="title"><Moment format="YYYY/MM/DD">{job.deadline}</Moment></span></p>
                                        {parseInt(job.maxap.application) <= job.applications.filter(app => app.reject === false).length || parseInt(job.maxap.position) <= job.applications.filter(app => app.accepted === true).length ? (
                                            <Fragment>
                                                <Link className="btn btn-danger m-1 login">Full</Link>
                                            </Fragment>
                                        ) : (
                                                <Fragment>
                                                    {aprofile.applications.findIndex(app => app.job === job._id) === -1 ? (
                                                        <Fragment>
                                                            {aprofile.applications.filter(app => app.rejected === false).length >= 10 ? (
                                                                <Fragment>
                                                                    <Link onClick={() => setAlert('Can not apply for more than 10 Applications', 'danger')} className="btn btn-primary m-1 login"> Apply </Link>
                                                                </Fragment>
                                                            ) : (
                                                                    <Fragment>
                                                                        <Link to={`/apply-job/${job._id}`} className="btn btn-primary m-1 login"> Apply</Link>
                                                                    </Fragment>
                                                                )}
                                                        </Fragment>
                                                    ) : (
                                                            <Fragment>
                                                                <Link className="btn btn-warning m-1 login">Applied</Link>
                                                            </Fragment>
                                                        )}
                                                </Fragment>
                                            )}
                                    </div>
                                ))}
                            </Fragment>
                        ) : (
                                <Fragment>
                                    <h2>No Jobs Available</h2>
                                </Fragment>
                            )}
                    </Fragment>
                )
            }
        </Fragment>

    )
};

JobListing.propTypes = {
    getJobs: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    job: PropTypes.object.isRequired,
    aprofile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    job: state.job,
    aprofile: state.aprofile
});

export default connect(mapStateToProps, { getJobs, setAlert })(JobListing);
