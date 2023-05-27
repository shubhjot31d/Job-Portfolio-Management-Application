import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { editJob } from '../../actions/job';
import { setAlert } from '../../actions/alert';

const EditJob = ({ match, setAlert, editJob, history }) => {
    const [formData, setFormData] = useState({
        application: '',
        position: '',
        deadline: '',
    });
    const {
        application,
        position,
        deadline,
    } = formData;

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    const onSubmit = async e => {
        e.preventDefault();
        console.log(formData);
        if (parseInt(application) < parseInt(position)) {
            setAlert('Applications must be Greater than Positions', 'danger');
        }
        else {
            editJob(match.params.id, formData, history);
        }

    };
    return (
        <Fragment>
            <h1 className="text-center heading">
                Edit Job
      </h1>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Max No. of Applications" name="application" value={application} onChange={e => onChange(e)} />
                    <small>Max no. of the applications</small>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Max No. of Positions" name="position" value={position} onChange={e => onChange(e)} />
                    <small>Max no. of positions</small>
                </div>
                <div className="form-group">
                    <input type="date" name="deadline" value={deadline} onChange={e => onChange(e)} />
                    <small>Deadline for Job Application</small>
                </div>

                <div className="text-center login">
                    <button type="submit" className="btn btn-dark m-1 login"> Edit Job <i className="fa fa-briefcase"></i></button>
                    <Link className="btn btn-light m-1 login" to="/rec-job-listing">Go Back <i className="fa fa-backward"></i></Link>
                </div>
            </form>
        </Fragment>
    )
};

EditJob.propTypes = {
    editJob: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

export default connect(null, { editJob, setAlert })(withRouter(EditJob));
