import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateRprofile from './components/forms/CreateRprofile';
import CreateAprofile from './components/forms/CreateAprofile';
import AddEducation from './components/forms/AddEducation';
import EditAprofile from './components/forms/EditAprofile';
import JobListing from './components/applicant/JobListing';
import AddJob from './components/forms/AddJob';
import ApplyJob from './components/forms/ApplyJob';
import MyApplications from './components/applicant/MyApplications';
import RecJobListing from './components/recruiter/RecJobListing';
import EditJob from './components/forms/EditJob';
import JobApplicants from './components/recruiter/JobApplicants';
import SelectedApplicants from './components/recruiter/SelectedApplicants';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
//redux stuff
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
//import JobListing from './components/applicant/JobListing';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-rprofile" component={CreateRprofile} />
              <PrivateRoute exact path="/create-aprofile" component={CreateAprofile} />
              <PrivateRoute exact path="/edit-aprofile" component={EditAprofile} />
              <PrivateRoute exact path="/add-education" component={AddEducation} />
              <PrivateRoute exact path="/job-listing" component={JobListing} />
              <PrivateRoute exact path="/add-job" component={AddJob} />
              <PrivateRoute exact path="/apply-job/:id" component={ApplyJob} />
              <PrivateRoute exact path="/my-application" component={MyApplications} />
              <PrivateRoute exact path="/rec-job-listing" component={RecJobListing} />
              <PrivateRoute exact path="/edit-job/:id" component={EditJob} />
              <PrivateRoute exact path="/job-applicants/:id" component={JobApplicants} />
              <PrivateRoute exact path="/selected-applicants" component={SelectedApplicants} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
