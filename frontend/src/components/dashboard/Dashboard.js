import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Applicant from '../applicant/Applicant';
import Recruiter from '../recruiter/Recruiter';
import Spinner from '../layout/Spinner';

const Dashboard = ({ auth: { user, loading, isAuthenticated } }) => {
    return loading || user === null ? (
        <Spinner />
    ) : (
            <Fragment>
                {
                    user.typeofuser === "Applicant" ? (
                        <Applicant />
                    ) : (
                            <Recruiter />
                        )
                }
            </Fragment >
        );

};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);
