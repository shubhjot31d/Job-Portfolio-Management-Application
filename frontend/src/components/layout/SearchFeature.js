import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchTitle } from '../../actions/job';

const SearchFeature = ({ searchTitle }) => {
    const [Searchdata, SetSearchData] = useState({
        search: ""
    });

    const { search } = Searchdata;

    const onChange = e => SetSearchData({
        ...Searchdata,
        [e.target.name]: e.target.value
    });
    const onSubmit = async e => {
        e.preventDefault();
        // console.log(Searchdata);
        searchTitle(search);
    };

    return (
        <Fragment>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group d-flex">
                    <input type="text" placeholder="Search...." name="search" value={search} onChange={e => onChange(e)} />
                    <button type="submit" className="btn btn-primary m-1"><i className="fa fa-search"></i></button>
                </div>
            </form>
        </Fragment>
    )
};

SearchFeature.propTypes = {
    searchTitle: PropTypes.func.isRequired,
};

export default connect(null, { searchTitle })(SearchFeature);
