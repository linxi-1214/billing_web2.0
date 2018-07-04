import React, { Component } from 'react';
import axios from 'axios';
import { reportDetailRenderer } from 'containers/report/renderer/report';

const moment = require('moment');

class ReportDetailForm extends Component {
    constructor(props) {
        super(props);

        const searchParams = new URLSearchParams(this.props.location.search);
        let reportType = searchParams.get('rt');
        let uid = searchParams.get('uid');
        let startTimestamp = searchParams.get('st');
        let endTimestamp = searchParams.get('et');

        let start = moment(parseInt(startTimestamp) * 1000).format('YYYY/MM/DD');
        let end = moment(parseInt(endTimestamp) * 1000).format('YYYY/MM/DD');

        this.state = {
            uid: uid,
            start: start,
            end: end,
            reportType: reportType,
            reportDateRange: reportType == 'days' ? start : [start, end].join(' ~ '),
            isAllRequestsDone: true
        };
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTimeButtonClick = this.handleTimeButtonClick.bind(this);
    }

    handleUserChange(state, value) {
        this.setState({[state]: value});
    }

    handleTimeChange(start, end) {
        this.setState({start: start, end: end});
    }

    handleTimeButtonClick(event) {
        this.setState({reportType: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="report container">
                {reportDetailRenderer.bind(this)()}
            </div>
        )
    }
}

export default ReportDetailForm;