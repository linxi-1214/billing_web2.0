import React, {Component} from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Datetime from 'react-datetime';
import { Input } from 'reactstrap'

const qs = require('qs');
const moment = require('moment');
const classnames = require('classnames');

class WrappedDateRangePicker extends Component {
    constructor(props) {
        super(props);
        let now = new Date();

        this.state = {
            start: moment(now).format('YYYY-MM-DD'),
            end: moment(now).format('YYYY-MM-DD')
        };

        this.handleDateEvent = this.handleDateEvent.bind(this);
    }

    handleDateEvent(event, picker) {
        let start = picker.startDate.format('YYYY-MM-DD');
        let end = picker.endDate.format('YYYY-MM-DD');
        this.setState({ start: start, end: end });
        this.props.onTimeChange(start, end);
    }

    render() {
        let start = this.props.start == null ? this.state.start : this.props.start;
        let end = this.props.end == null ? this.state.end : this.props.end;
        return (
            <DateRangePicker
                startDate={start}
                endDate={end}
                autoApply={true}
                onEvent={this.handleDateEvent}
                containerStyles={{display: 'inline-block', width: '100%'}}
                locale={{
                    format: "YYYY-MM-DD",
                    separator: " ~ ",
                    fromLabel: "From",
                    toLabel: "To",
                    customRangeLabel: "Custom",
                    weekLabel: "W",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                    firstDay: 1
                }}
            >
                <Input type="text" disabled value={start + ' ~ ' + end} {...this.props.inputProps}
                       className={classnames("bg-white", this.props.className)} />
            </DateRangePicker>
        )
    }
}

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.inputRenderer = this.inputRenderer.bind(this);
    }

    handleChange(momentObj) {
        let year = momentObj.year();
        let month = momentObj.month();
        let start = null, end =null;
        switch(this.props.viewMode) {
            case 'years':
                start = momentObj.format('YYYY-01-01');
                end = momentObj.format('YYYY-12-31');
                break;
            case 'months':
                start = moment([year, month, 1]).format('YYYY-MM-DD');
                end = moment([year, month, 1]).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
                break;
            case 'days':
                start = momentObj.format('YYYY-MM-DD');
                end = start;
                break;
        }

        this.props.onTimeChange(start, end);
    }

    inputRenderer(props, openCalendar, closeCalendar) {
        return <Input type="text" readOnly {...props} className="bg-white" onFocus={openCalendar} onClick={openCalendar} />
    }

    render() {
        return <Datetime timeFormat={false} dateFormat={this.props.dateFormat} locale="zh-cn"
                         onChange={this.handleChange} renderInput={this.inputRenderer} className="bg-white"
                         closeOnSelect={true}
                         viewMode={this.props.viewMode}/>
    }
}

export {WrappedDateRangePicker, DatePicker};