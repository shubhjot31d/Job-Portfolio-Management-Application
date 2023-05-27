import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/auth';

const Navbar = ({ logoutUser, auth: { loading, isAuthenticated } }) => {
    return (
        <nav className="navbar sticky-top navbar-default bg-dark p-0 m-0">
            <div className="container-fluid p-0 m-0">
                <div className="navbar-header">
                    <Link className="navbar-brand" to='/'><i class="fa fa-tags" ></i>
                        <span classname="brand-text heading"> JoBuzz</span></Link>
                </div>
                <ul className=" navbar-right d-flex">
                    {loading || !isAuthenticated ? (
                        <Fragment>
                            <li><Link to='/register' className="navbar-links"> <i className="fa fa-user"></i><span className="login"> Sign Up</span></Link></li>
                            <li><Link to='/login' className="navbar-links"> <i className="fa fa-sign-in"></i><span className="login"> Login</span></Link></li>
                        </Fragment>
                    ) : (
                            <Fragment>
                                <li><Link to="/dashboard" className="navbar-links"><i className="fa fa-user"></i><span className="login">Dashboard</span></Link></li>
                                <li><Link onClick={logoutUser} to='/' className="navbar-links"><i className="fa fa-sign-out"></i><span className="login">Logout</span></Link></li>
                            </Fragment>
                        )}
                </ul>
            </div>
        </nav >
    )
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
