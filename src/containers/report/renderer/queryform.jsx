import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Form, FormGroup, Button } from 'reactstrap';

import {AsyncSelect} from 'libs/dropdown';
import {WrappedDateRangePicker, DatePicker} from 'libs/dates';

const qs = require('qs');
const moment = require('moment');
const classnames = require('classnames');

class NullWrapper extends Component {
    render() {
        return this.props.children;
    }
}

function datePickerSelector(onTimeChange) {
    const { reportType } = this.state;
    switch(reportType) {
        case 'years':
            return <DatePicker inputProps={{placeholder: '请选择年份'}} dateFormat="YYYY" viewMode="years" onTimeChange={onTimeChange} />;
        case 'months':
            return <DatePicker inputProps={{placeholder: '请选择月份'}} dateFormat="YYYY-MM" viewMode="months" onTimeChange={onTimeChange} />;
        case 'days':
            return <DatePicker inputProps={{placeholder: '请选择日期'}} dateFormat="YYYY-MM-DD" viewMode="days" onTimeChange={onTimeChange} />;
        case 'custom':
            return <WrappedDateRangePicker inputProps={{placeholder: '开始日期 ~ 结束日期'}} onTimeChange={onTimeChange} />;
        default:
            return <DatePicker inputProps={{placeholder: '请选择月份'}} viewMode="months" onTimeChange={onTimeChange} />;
    }
}


export function reportFormRenderer() {
    const { uid, reportType } = this.state;
    return (
        <Form>
            <FormGroup>
                <Button color="primary" size="sm" value="days" className={classnames({'btn-outline-primary': reportType != 'days'})} onClick={this.handleTimeButtonClick}>日报</Button>
                <Button color="primary" size="sm" value="months" className={classnames("ml-5", {'btn-outline-primary': reportType != 'months'})} onClick={this.handleTimeButtonClick}>月报</Button>
                <Button color="primary" size="sm" value="years" className={classnames("ml-5", {'btn-outline-primary': reportType != 'years'})} onClick={this.handleTimeButtonClick}>年报</Button>
                <Button color="primary" size="sm" value="custom" className={classnames("ml-5", {'btn-outline-primary': reportType != 'custom'})} onClick={this.handleTimeButtonClick}>自定义</Button>
            </FormGroup>
            <FormGroup>
                {datePickerSelector.bind(this)(this.handleTimeChange)}
            </FormGroup>
            <FormGroup>
                <AsyncSelect onChange={this.handleUserChange} name="uid"
                             labelKey="name" valueKey="user_id" value={uid}
                             url="/billing/api/user/list"
                />
            </FormGroup>
            <Button size="sm" block color="primary" onClick={this.handleSubmit}>生成报告</Button>
        </Form>
    )
}
