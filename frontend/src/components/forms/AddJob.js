import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addJob } from '../../actions/job';
import { setAlert } from '../../actions/alert';

const AddJob = ({ setAlert, addJob, history }) => {
    const [formData, setFormData] = useState({
        title: '',
        application: '',
        position: '',
        deadline: '',
        skills: '',
        typeofjob: '',
        duration: '',
        salary: '',
    });
    const {
        title,
        application,
        position,
        deadline,
        skills,
        typeofjob,
        duration,
        salary,
    } = formData;

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    const onSubmit = async e => {
        e.preventDefault();
        console.log(formData);
        if (parseInt(application) < parseInt(position) || parseInt(salary) < 0) {

            if (parseInt(application) < parseInt(position)) {
                setAlert('Applications must be Greater than Positions', 'danger');
            }
            if (parseInt(salary) < 0) {
                setAlert('Salary can not be negative', 'danger');
            }
        }
        else {
            addJob(formData, history);
        }

    };
    return (
        <Fragment>
            <h1 className="text-center heading">
                Add a Job
      </h1>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Title" name="title" value={title} onChange={e => onChange(e)} />
                    <small>The Title of the Job</small>
                </div>
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
                <div className="form-group">
                    <input type="text" placeholder="Skills" name="skills" value={skills} onChange={e => onChange(e)} />
                    <small>Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small>
                </div>
                <div className="form-group">
                    <select name="typeofjob" value={typeofjob} onChange={e => onChange(e)} >
                        <option typeofjob=""> None </option>
                        <option typeofjob="Full-Time"> Full Time </option>
                        <option typeofjob="Part-Time"> Part Time </option>
                        <option typeofjob="Work-from-home"> Work From Home </option>
                    </select>
                    <small>Select the Type of Job</small>
                </div>
                <div className="form-group">
                    <input type="text" name="duration" value={duration} onChange={e => onChange(e)} />
                    <small>Duration of Job , select from 0-6</small>
                </div>

                <div className="form-group">
                    <input type="text" name="salary" value={salary} onChange={e => onChange(e)} />
                    <small>Salary amounted for the Job per month</small>
                </div>
                <div className="text-center login">
                    <button type="submit" className="btn btn-danger m-1 login"> Add Job <i className="fa fa-briefcase"></i></button>
                    <Link className="btn btn-light m-1 login" to="/dashboard">Go Back <i className="fa fa-backward"></i></Link>
                </div>
            </form>
        </Fragment>
    )
};

AddJob.propTypes = {
    addJob: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

export default connect(null, { addJob, setAlert })(withRouter(AddJob));
