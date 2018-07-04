import React, {Component} from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Button, Modal, ModalHeader, ModelBody, Label, Input, Form, FormGroup, Col } from 'reactstrap';
import { WrappedDateRangePicker } from 'libs/dates';
import { AsyncSelect } from 'libs/dropdown';

const qs = require('qs');
const moment = require('moment');
const classnames = require('classnames');

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.echarts = React.createRef();

        this.getOption = this.getOption.bind(this);
        this.request = this.request.bind(this);
    }

    componentDidUpdate() {
        let echarts_instance = this.echarts.current.getEchartsInstance();
        echarts_instance.showLoading();
        this.request(echarts_instance);
    }

    request(echarts_instance) {
        let needParams = this.props.needParams || true;
        if (needParams && this.props.requestData == null || this.props.requestData == undefined) {
            echarts_instance.hideLoading();
            return;
        }

        axios({
                url: this.props.url,
                method: 'get',
                params: this.props.requestData
            })
                .then(response => {
                    echarts_instance.hideLoading();
                    if (response.status == '200') {
                        let option = this.getOption(response.data.states, response.data.dataset, response.data.states);
                        echarts_instance.setOption(option);
                    }
                });
    }

    getOption(dimensions, dataset, series) {
        let real_series = series ? series : [];
        return {
            title: { text: this.props.title },
            tooltip: { trigger: 'axis' },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '50px',
                containLabel: true
            },
            dataset: {
                dimensions: dimensions || [],
                source: dataset || []
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            dataZoom: [
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M0 0 L30 0 L30 150 L 0 150 Z',
                    handleSize: '100%',
                    handleStyle: {
                        color: '#6c757d',
                        shadowBlur: 1,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                    }
                }
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: { show: false }
            },
            yAxis: {
                name: this.props.yAxisName,
                type: 'value',
                splitLine: { show: true }
            },
            series: real_series.map(name => {
                return {
                    type: 'line', smooth: true,
                    label: {
                        formatter: this.props.formatter,
                        show: true,
                        position: 'top'

                    },
                }
            })
        }
    }

    render() {
        return <ReactEcharts ref={this.echarts} option={this.getOption()} notMerge={true}  style={{height: this.props.height || '350px'}} />;
    }
}

class VBarChart extends Component {
    constructor(props) {
        super(props);

        this.echarts = React.createRef();

        this.getOption = this.getOption.bind(this);
        this.request = this.request.bind(this);
    }

    componentDidUpdate() {
        let echarts_instance = this.echarts.current.getEchartsInstance();
        echarts_instance.showLoading();
        this.request(echarts_instance);
    }

    request(echarts_instance) {
        let needParams = this.props.needParams || true;
        if (needParams && this.props.requestData == null || this.props.requestData == undefined) {
            echarts_instance.hideLoading();
            return;
        }
        axios({
                url: this.props.url,
                method: 'get',
                params: this.props.requestData
            })
                .then(response => {
                    echarts_instance.hideLoading();
                    if (response.status == '200') {
                        let option = this.getOption(response.data.states, response.data.dataset, response.data.states);
                        echarts_instance.setOption(option);
                    }
                });
    }

    getOption(dimensions, dataset, series) {
        let real_series = series ? series : [];
        return {
            title: { text: this.props.title },
            tooltip: { trigger: 'axis' },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '50px',
                containLabel: true
            },
            dataset: {
                dimensions: dimensions || [],
                source: dataset || []
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            dataZoom: [
                {
                    start: 0,
                    end: 100,
                    handleIcon: 'M0 0 L30 0 L30 150 L 0 150 Z',
                    handleSize: '100%',
                    handleStyle: {
                        color: '#6c757d',
                        shadowBlur: 1,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                    }
                }
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: { show: false }
            },
            yAxis: {
                name: this.props.yAxisName,
                type: 'value',
                splitLine: { show: true }
            },
            series: real_series.map(name => {
                return {
                    type: 'bar',
                    itemStyle: {
                        barBorderRadius: [5, 5, 2, 2]
                    },
                    label: {
                        formatter: this.props.formatter,
                        show: true,
                        position: 'top'

                    },
                }
            })
        }
    }

    render() {
        return <ReactEcharts ref={this.echarts} option={this.getOption()} notMerge={true}  style={{height: this.props.height || '350px'}} />;
    }
}

export {LineChart, VBarChart};