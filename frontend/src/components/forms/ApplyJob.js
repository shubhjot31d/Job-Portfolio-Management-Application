import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { applyJob } from '../../actions/job';

const ApplyJob = ({ match, applyJob, history }) => {
    const [sopData, setSopData] = useState({
        sop: '',
    });
    const { sop } = sopData;

    const onChange = e => setSopData({
        ...sopData,
        [e.target.name]: e.target.value
    });

    const onSubmit = async e => {
        e.preventDefault();
        console.log(sopData);
        applyJob(match.params.id, sop, history);
    };

    return (
        <Fragment>
            <h1>Apply for the Job</h1>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <textarea placeholder="Statement Of Purpose" name="sop" value={sop} onChange={e => onChange(e)}></textarea>
                    <small> Your Short Bio</small>
                </div>
                <input type="submit" className="btn btn-primary m-1" value="Apply for Job" />
            </form>
        </Fragment>
    )
};

ApplyJob.propTypes = {
    applyJob: PropTypes.func.isRequired,
};

export default connect(null, { applyJob })(withRouter(ApplyJob));
