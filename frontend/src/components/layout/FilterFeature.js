import React, { useState, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { filterJobs } from '../../actions/job';

const FilterFeature = ({ setAlert, filterJobs }) => {
    const [formData, SetFormData] = useState({
        typeofjob: '',
        usalary: '',
        lsalary: '',
        duration: ''
    });

    const [isOpen, setIsOpen] = React.useState(false);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const { typeofjob, usalary, lsalary, duration } = formData;

    const onChange = e => SetFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const onSubmit = async e => {
        e.preventDefault();
        // console.log(formData);
        if (parseInt(duration) === 0 || duration === '') {
            setAlert('Duration should be greater than zero', 'danger');
        }
        else if (lsalary !== '' && parseInt(lsalary) < 0) {
            setAlert('Lower Limit of Salary must be greater than zero', 'danger');
        }
        else if (usalary !== '' && parseInt(usalary) < 0) {
            setAlert('Upper Limit of Salary must be greater than zero', 'danger');
        }
        else if (lsalary !== '' && usalary !== '' && parseInt(lsalary) >= parseInt(usalary)) {
            setAlert('Upper Limit must be greater than lower limit of salary', 'danger');
        }
        else {
            console.log(formData);
            filterJobs(formData);
        }
    };

    return (
        <Fragment>
            <button onClick={showModal} className="btn btn-info m-1 login">Filter <i className="fa fa-briefcase"></i></button>
            <Modal show={isOpen} onHide={hideModal}>
                <Modal.Header>
                    <Modal.Title>Filter Jobs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form" onSubmit={e => onSubmit(e)}>
                        <div className="form-group">
                            <select name="typeofjob" value={typeofjob} onChange={e => onChange(e)} >
                                <option value=""> None </option>
                                <option value="Full Time"> Full Time </option>
                                <option value="Part Time"> Part Time </option>
                                <option value="Work From Home"> Work From Home </option>
                            </select>
                            <small>Select the Type of Job</small>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Lower Limit of salary" name="lsalary" value={lsalary} onChange={e => onChange(e)} />
                            <small>Lower Limit of Salary</small>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Upper Limit of salary" name="usalary" value={usalary} onChange={e => onChange(e)} />
                            <small>Upper Limit of Salary</small>
                        </div>
                        <div className="form-group">
                            <select name="duration" value={duration} onChange={e => onChange(e)} >
                                <option value="0"> None </option>
                                <option value="1"> 1 </option>
                                <option value="2"> 2 </option>
                                <option value="3"> 3 </option>
                                <option value="4"> 4 </option>
                                <option value="5"> 5 </option>
                                <option value="6"> 6 </option>
                                <option value="7"> 7 </option>
                            </select>
                            <small>Duration of Job , must be between 1-7 months</small>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-info m-1" onClick={hideModal}><i className="fa fa-filter"></i></button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={hideModal} className="btn btn-danger">Cancel <i className="fa fa-minus-square"></i></button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};

FilterFeature.propTypes = {
    setAlert: PropTypes.func.isRequired,
    filterJobs: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, filterJobs })(FilterFeature);
