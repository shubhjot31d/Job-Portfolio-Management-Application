import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { getProfilesByJobId, rejectApplication, shortlistApplication, acceptApplication } from '../../actions/aprofile';
import { getJobById } from '../../actions/job';
import { setAlert } from '../../actions/alert';
import Spinner from '../layout/Spinner';
import SortFeatureApplicant from './SortFeatureApplicant';

const JobApplicants = ({ match, getProfilesByJobId, getJobById, setAlert, rejectApplication, shortlistApplication, acceptApplication, aprofile: { loading, aprofiles }, job }) => {
    useEffect(() => {
        getProfilesByJobId(match.params.id);
        getJobById(match.params.id);
    }, []);
    return (
        <Fragment>
            {loading || job.loading ? <Spinner /> : (
                <Fragment>
                    <h1 className="text-center heading">Applicants</h1>
                    {aprofiles.length > 0 ? (
                        <Fragment>
                            <SortFeatureApplicant jobId={match.params.id} />
                            <Link className="btn btn-light m-1 login" to="/rec-job-listing">Go Back <i className="fa fa-backward"></i></Link>
                            {aprofiles.map(aprofile => (
                                <Fragment>
                                    <div className="container bg-light m-1 border border-success">
                                        {aprofile.applications.map(app => app.job === match.params.id && app.rejected === false && <Fragment>
                                            <h3 className="text-center title">{aprofile.user.name}</h3>
                                            <h3 className="field">Skills</h3>
                                            <ul>
                                                {aprofile.skills.length > 0 ? (
                                                    <Fragment>
                                                        {aprofile.skills.map(skill => (
                                                            <li><i className="fa fa-thumbs-up"></i> {skill}</li>
                                                        ))}
                                                    </Fragment>
                                                ) : (<Fragment></Fragment>)}

                                            </ul>
                                            <h3 className="field">Education</h3>
                                            {aprofile.education.length > 0 ? (
                                                <Fragment>
                                                    {aprofile.education.map(edu => (<Fragment>
                                                        <div>
                                                            <i className="fa fa-university"></i>
                                                            <p> <i className="fa fa-book"></i>Studied at {edu.school}</p>
                                                            <p><i className="fa fa-book"></i>{edu.fieldofstudy}</p>
                                                            <p><i className="fa fa-book"></i> From <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
                                    {edu.to === null ? ('Current') : (<Moment format="YYYY/MM/DD">{edu.to}</Moment>)}
                                                            </p>
                                                        </div>
                                                    </Fragment>
                                                    ))}
                                                </Fragment>
                                            ) : (<Fragment></Fragment>)}
                                            <p className="m-0"><span className="field">Rating</span> : {aprofile.rating}</p>
                                            <p className="m-0"> <span className="field">Date of Application</span> : <Moment format="YYYY/MM/DD">{app.dateofapplication}</Moment></p>
                                            <p className="m-0"> <span className="field">SOP</span> : {app.sop}</p>
                                            {app.shortlisted === false && app.accepted === false && <Fragment>
                                                <Link onClick={() => shortlistApplication(match.params.id, aprofile._id)} className="btn btn-primary m-1 login">Shortlist</Link>
                                                <Link onClick={() => rejectApplication(match.params.id, aprofile._id)} className="btn btn-danger m-1 login">Reject</Link>
                                            </Fragment>}
                                            {app.shortlisted === true && app.accepted === false && <Fragment>
                                                {parseInt(job.job.maxap.position) > aprofile.applications.filter(app => app.accepted === true).length ? (
                                                    <Link onClick={() => acceptApplication(match.params.id, aprofile._id)} className="btn btn-warning m-1 login">Accept</Link>
                                                ) : (
                                                        <Link onClick={() => setAlert('No more positions left for this job', 'danger')} className="btn btn-warning m-1 login">Accept</Link>
                                                    )}
                                                <Link onClick={() => rejectApplication(match.params.id, aprofile._id)} className="btn btn-danger m-1 login">Reject</Link>
                                            </Fragment>}
                                            {app.shortlisted === false && app.accepted === true && <Fragment>
                                                <Link className="btn btn-info m-1 login">Accepted</Link>

                                            </Fragment>}
                                        </Fragment>)}
                                    </div>
                                </Fragment>
                            ))}
                        </Fragment>
                    ) : (
                            <Fragment>
                                <h2>No Applicants</h2>
                            </Fragment>
                        )}
                </Fragment>
            )}
        </Fragment>
    )
};

JobApplicants.propTypes = {
    getProfilesByJobId: PropTypes.func.isRequired,
    getJobById: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    rejectApplication: PropTypes.func.isRequired,
    shortlistApplication: PropTypes.func.isRequired,
    acceptApplication: PropTypes.func.isRequired,
    aprofile: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    aprofile: state.aprofile,
    job: state.job
});

export default connect(mapStateToProps, { getProfilesByJobId, getJobById, setAlert, rejectApplication, shortlistApplication, acceptApplication })(JobApplicants);
