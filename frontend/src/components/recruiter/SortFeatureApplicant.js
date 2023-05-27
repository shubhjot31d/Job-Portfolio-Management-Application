import React, { useState, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortAprofiles } from '../../actions/aprofile';

const SortFeatureApplicant = ({ jobId, sortAprofiles }) => {
    const [Sortdata, SetSortData] = useState({
        sort: ""
    });

    const { sort } = Sortdata;

    const [isOpen, setIsOpen] = React.useState(false);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const onChange = e => SetSortData({
        ...Sortdata,
        [e.target.name]: e.target.value
    });
    const onSubmit = async e => {
        e.preventDefault();
        //console.log(Sortdata);
        sortAprofiles(jobId, sort);
    };

    return (
        <Fragment>
            <button onClick={showModal} className="btn btn-warning m-1 login">Sort <i className="fa fa-user"></i></button>
            <Modal show={isOpen} onHide={hideModal}>
                <Modal.Header>
                    <Modal.Title>Sort Applicants</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="form" onSubmit={e => onSubmit(e)}>
                        <div className="form-group d-flex">
                            <select placeholder="Sort.... " name="sort" value={sort} onChange={e => onChange(e)} >
                                <option value=""> None </option>
                                <option value="name 1"> Name &#xf160;</option>
                                <option value="name -1"> Name &#xf161;</option>
                                <option value="date 1"> Date of Application &#xf160;</option>
                                <option value="date -1"> Date Of Application &#xf161;</option>
                                <option value="rating 1"> Rating &#xf160;</option>
                                <option value="rating -1"> Rating &#xf161;</option>
                            </select>
                            <button type="submit" className="btn btn-warning m-1" onClick={hideModal} ><i className="fa fa-sort"></i></button>
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

SortFeatureApplicant.propTypes = {
    sortAprofiles: PropTypes.func.isRequired,
    jobId: PropTypes.string.isRequired,
};

export default connect(null, { sortAprofiles })(SortFeatureApplicant);
