import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { getAcceptedProfileByRec } from '../../actions/aprofile';
import Spinner from '../layout/Spinner';
import RateApplicant from './RateApplicant';
import SortSelected from './SortSelected';


const SelectedApplicants = ({ getAcceptedProfileByRec, aprofile }) => {
    useEffect(() => {
        getAcceptedProfileByRec();
    }, [getAcceptedProfileByRec]);
    return (
        <Fragment>
            {aprofile.loading ? <Spinner /> : (
                <Fragment>
                    {aprofile.aprofiles.length > 0 ? (
                        <Fragment>
                            <h1 className="text-center heading">Selected Applicants</h1>
                            <SortSelected />
                            {aprofile.aprofiles.map(aprofile => (
                                <Fragment>
                                    <div className="container bg-light m-1 border border-success">
                                        {aprofile.applications.map(app => app.accepted === true && <Fragment>
                                            <h3 className="title"> {aprofile.user.name}</h3>
                                            <p className="m-0"> <span className="field">Title</span> :<span className="title"> {app.job.title}</span></p>
                                            <p className="m-0"><span className="field">Type Of Job</span> : <span className="title"> {app.job.typeofjob}</span></p>
                                            <p className="m-0"><span className="field">Date Of Joining</span> : <span className="title"><Moment format="YYYY/MM/DD">{app.dateofjoining}</Moment></span></p>
                                            <RateApplicant AprofileId={aprofile._id} />
                                        </Fragment>)}
                                    </div>
                                </Fragment>
                            ))}
                        </Fragment>
                    ) : (
                            <Fragment>
                                <h1>No Selected Applicants</h1>
                            </Fragment>
                        )}
                </Fragment>
            )
            }
        </Fragment >
    )
};

SelectedApplicants.propTypes = {
    getAcceptedProfileByRec: PropTypes.func.isRequired,
    aprofile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    aprofile: state.aprofile
});

export default connect(mapStateToProps, { getAcceptedProfileByRec })(SelectedApplicants);
