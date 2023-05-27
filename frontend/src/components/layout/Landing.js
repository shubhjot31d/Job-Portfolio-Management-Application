import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <section className="landing">
            <div className="landing-inner">
                <p className="landing-heading">JoBuzz</p>
                <p className="landing-text">A platform for both recruiters and applicants for Job Buzzing.</p>
                <div className="landing-buttons col-md-4 col-lg-2 login">
                    <Link to='/register' className="btn btn-primary m-1 landing-btn" role="button">Sign Up</Link>
                    <Link to='/login' className="btn btn-light m-1 landing-btn" role="button">Login</Link>
                </div>
            </div>
        </section>
    )
};

export default Landing;
