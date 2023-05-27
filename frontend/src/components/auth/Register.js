import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        typeofuser: '',
        password: '',
        password2: ''
    });

    const { name, email, typeofuser, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords Do not match ', 'danger');
        }
        else {
            register({ name, email, typeofuser, password });
        }
    }

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <h1 className="text-center heading">Sign Up</h1>
            <p className="text-center login"><i className="fa fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <select name="typeofuser" value={typeofuser} onChange={e => onChange(e)} >
                        <option typeofuser="">None</option>
                        <option typeofuser="Applicant"> Applicant</option>
                        <option typeofuser="Recruiter">Recruiter</option>
                    </select>
                    <small>Select whether Applicant or Recruiter</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}

                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="text-center login">
                    <button type="submit" className="btn btn-primary" ><i className="fa fa-user"></i> Register</button>
                </div>
            </form>
            <p className="m-1 text-center login">
                Already have an account ? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
