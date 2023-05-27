import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/rprofile';


const CreateRprofile = ({ createProfile, history }) => {
    const [formData, setFormData] = useState({
        contactno: '',
        bio: ''
    });

    const { contactno, bio } = formData;

    const onChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    const onSubmit = async e => {
        e.preventDefault();
        console.log(formData);
        createProfile(formData, history);
    };

    return (
        <Fragment>
            <h1 className="text-center heading"> Create Profile</h1>
            <p className="text-center text-info login"> <i className="fa fa-user"></i>Complete your profile</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Contact No" name="contactno" value={contactno} onChange={e => onChange(e)} />
                    <small>Contact No.</small>
                </div>

                <div className="form-group">
                    <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e => onChange(e)}></textarea>
                    <small> Your Short Bio</small>
                </div>
                <div className="text-center login">
                    <button type="submit" className="btn btn-info m-1 login"> Create Profile <i className="fa fa-tags"></i></button>
                    <Link className="btn btn-light m-1 login" to="/dashboard">Go Back <i className="fa fa-backward"></i></Link>
                </div>
            </form>
        </Fragment>
    )
};

CreateRprofile.propTypes = {
    createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(withRouter(CreateRprofile));
