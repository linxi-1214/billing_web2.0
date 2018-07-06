import React, { Component } from 'react';
import axios from 'axios';
import { reportFormRenderer, reportRenderer } from 'containers/report/renderer/queryform';

const PropTypes = require('prop-types');
const moment = require('moment');
const URLSearchParams = require('url-search-params');

class ReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
            start: null,
            end: null,
            month: null, onlyThisYear: 0,
            reportType: 'months',
        };
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTimeButtonClick = this.handleTimeButtonClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUserChange(state, value) {
        this.setState({[state]: value});
    }

    handleTimeChange(start, end) {
        if (this.state.reportType == 'months')
            this.state.month = moment(start).format('%Y-%m');
        this.setState({start: start, end: end, month: this.state.month});
    }

    handleTimeButtonClick(event) {
        this.setState({reportType: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event) {
        const {start, end} = this.state;
        let startTime = moment(start).unix();
        let endTime = moment(end).unix();
        let searchParams = new URLSearchParams({
                uid: this.state.uid,
                rt: this.state.reportType,
                st: startTime,
                et: endTime,
                oty: this.state.onlyThisYear
            });
        this.context.router.history.push({
            pathname: '/report/detail',
            search: searchParams.toString()
        });

        event.preventDefault();
    }
    render() {
        return (
            <div className="container">
                {reportFormRenderer.bind(this)()}
            </div>
        )
    }
}

ReportForm.contextTypes = {
    router: PropTypes.object.isRequired
};

export default ReportForm;