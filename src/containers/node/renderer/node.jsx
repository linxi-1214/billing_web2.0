import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import cookie from 'react-cookies';
import ReactEcharts from 'echarts-for-react';
import { Button, Modal, ModalHeader, ModelBody, Label, Input, Form, FormGroup, Col } from 'reactstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const qs = require('qs');
const classnames = require('classnames');

function formatter(params) {
    if (params.seriesName != '等待时间')
        return params.value[params.seriesName];

    let seconds = parseInt(params.value['等待时间']);

    const days = parseInt(seconds / 86400);
    seconds -= days * 86400;

    const hours = parseInt(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;

    let time_str = [hours, minutes, seconds].join(':');
    if (days != 0) {
        time_str = days + '-' + time_str
    }

    return time_str;
}

class NullWrapper extends Component {
    render() {
        return this.props.children;
    }
}
class WrapperSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin_options: null,
            option_key: null,
            selectedOption: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeOptions = this.changeOptions.bind(this);
    }

    componentDidMount() {
        axios({
            url: this.props.url,
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                this.setState({
                    origin_options: response.data,
                })
            });
    }

    changeOptions() {
        let origin_options = this.state.origin_options;
        if (this.props.option_key != null && this.state.origin_options != null && this.state.origin_options.hasOwnProperty(this.props.option_key))
            origin_options = this.state.origin_options[this.props.option_key];

        if (origin_options == null)
            return [];

        if (!(origin_options instanceof Array))
            return [];

        var options = origin_options.map(option =>{
            var op = {};
            Object.keys(option).map(key => {
                if (key == this.props.labelName)
                    op['label'] = option[key];
                if (key == this.props.valueName)
                    op['value'] = option[key];
            });
            return op;
        });

        return options;
    }

    handleChange(selectedOption) {
        this.setState({
            selectedOption: selectedOption
        });
        this.props.onChange(this.props.name, selectedOption);
    }

    render() {
        var options = this.changeOptions();
        return <Select
            id={this.props.id}
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            onChange={this.handleChange}
            autoFocus
            simpleValue
            clearable={true}
            name={this.props.name}
            options={options}
            className={this.props.className}
            value={this.state.selectedOption}
            searchable={true}
        />
    }
}

class ClusterPartitionSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {cluster: null};
        this.handleClusterChange = this.handleClusterChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClusterChange(state, value) {
        this.setState({cluster: value});
        this.props.onChange(state, value);
    }

    handleChange(state, value) {
        this.props.onChange(state, value)
    }

    render() {
        return (
            <NullWrapper>
                <div className="col">
                <WrapperSelect id="cluster-select" name="cluster" onChange={this.handleClusterChange}
                               labelName="name" valueName="name"
                               url="/billing/api/cluster/list"
                />
                </div>
                <div className="col">
                <WrapperSelect id="cluster-partition-select"  onChange={this.handleChange} name="partition"
                               labelName="partition" valueName="partition" option_key={this.state.cluster}
                               url={"/billing/api/cluster/partition/list?cluster=" + this.state.cluster + "&theme=" + this.props.theme + "&item=" + this.props.item}
                />
                </div>
            </NullWrapper>
        )
    }
}


class TimeSelect extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        let end = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
        let start_time = new Date(now.getTime() - 86400 * 1000);
        let start = [start_time.getFullYear(), start_time.getMonth() + 1, start_time.getDate()].join('-');
        this.state = {
            btn_selected: '1',
            date_range: [start, end].join(' ~ '),
            start: start, end: end
        };
        this.handleTimeButtonClick = this.handleTimeButtonClick.bind(this);
        this.handleDateEvent = this.handleDateEvent.bind(this);
        this.handleClusterPartitionChange = this.handleClusterPartitionChange.bind(this);
    }

    handleTimeButtonClick(event) {
        const target = event.target;
        const time_range = target.value;
        let start = this.state.start_day;
        let end = this.state.end_day;

        if (time_range != 'all') {
            let now = new Date();
            end = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
            let start_time = new Date(now.getTime() - parseInt(time_range) * 86400 * 1000);
            start = [start_time.getFullYear(), start_time.getMonth() + 1, start_time.getDate()].join('-');
        } else {
            start = null;
            end = null;
        }

        this.setState({
            btn_selected: time_range,
            start: start, end: end,
            date_range: [start, end].join(' ~ ')
        });
        this.props.onTimeChange(start, end);

        event.preventDefault();
    }

    handleDateEvent(event, picker) {
        this.setState({
            date_range: [picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD')].join(picker.locale.separator),
            start: picker.startDate.format('YYYY-MM-DD'),
            end: picker.endDate.format('YYYY-MM-DD'),
            btn_selected: null
        });
        this.props.onTimeChange(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'))
    }

    handleClusterPartitionChange(state, value) {
        this.props.onClusterChange(state, value)
    }

    render() {
        return (
            <Form>
                <div className="form-row">
                    <div className="col-4">
                        <Label className="mr-sm-2">时间</Label>
                        {this.state.btn_selected == '1' ?
                            <Button color="primary" value="1" className="ml-5" onClick={this.handleTimeButtonClick}>今天</Button>
                            :
                            <Button color="primary" value="1" outline className="ml-5" onClick={this.handleTimeButtonClick}>今天</Button>
                        }
                        {this.state.btn_selected == '7' ?
                            <Button color="primary" value="7" className="ml-3" onClick={this.handleTimeButtonClick}>7天</Button>
                            :
                            <Button color="primary" value="7" className="ml-3" outline onClick={this.handleTimeButtonClick}>7天</Button>
                        }
                        {this.state.btn_selected == '30' ?
                            <Button color="primary" value="30" className="ml-3" onClick={this.handleTimeButtonClick}>30天</Button>
                            :
                            <Button color="primary" value="30" className="ml-3" outline onClick={this.handleTimeButtonClick}>30天</Button>
                        }
                        {this.state.btn_selected == 'all' ?
                            <Button color="primary" value="all" className="ml-3" onClick={this.handleTimeButtonClick}>全部</Button>
                            :
                            <Button color="primary" value="all" className="ml-3" outline onClick={this.handleTimeButtonClick}>全部</Button>
                        }
                    </div>
                    <div className="col-3">
                        <DateRangePicker
                            startDate={this.state.start}
                            endDate={this.state.end}
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
                            <Input type="text" disabled value={this.state.date_range} name="email" className="ml-2 bg-white" placeholder="起讫时间" />
                        </DateRangePicker>
                    </div>
                    <div className="col-1 mt-1 ml-auto">
                    <Label className="mr-sm-2">超算/节点</Label>
                    </div>
                    <div className={classnames("col-3", {'form-row': this.props.item == 'STATE'})}>
                        {
                            this.props.item == 'STATE' ?
                                <ClusterPartitionSelect theme={this.props.theme} item={this.props.item}
                                                        onChange={this.handleClusterPartitionChange}/>
                                :
                                <WrapperSelect id="cluster-select" name="cluster"
                                               labelName="name" valueName="name"
                                               url="/billing/api/cluster/list"
                                               onChange={this.handleClusterPartitionChange}
                                />
                        }
                    </div>
                </div>
            </Form>
        )
    }
}

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
        const cluster = this.props.cluster;
        const start = this.props.start;
        const end = this.props.end;
        const partition = this.props.partition;

        if (cluster == null || start == null || end == null || partition == null) {
            echarts_instance.hideLoading();
            return;
        }

        let data = {cluster: cluster, start: start, end:end};
        axios({
                url: this.props.url,
                method: 'get',
                params: data
            })
                .then(response => {
                    echarts_instance.hideLoading();
                    if (response.status == '200') {
                        let option = this.getOption(['date'].concat(response.data.states), response.data.dataset, response.data.states);
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
                    handleSize: '90%',
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
        return <ReactEcharts ref={this.echarts} option={this.getOption()} notMerge={true}  style={{height: '350px'}} />;
    }
}

export function nodeStateRenderer() {
    return (
        <NullWrapper>
            <TimeSelect item="STATE" theme="NODE" onClusterChange={this.handleClusterChange} onTimeChange={this.handleTimeChange}/>
            <div className="shadow-sm p-3 mb-5 bg-white rounded mt-5">
                <LineChart title={"节点状态信息"} yAxisName={"数目"} formatter={formatter}
                           url="/billing/api/node/state/info"
                           cluster={this.state.cluster} partition={this.state.partition}
                           start={this.state.start} end={this.state.end}/>
            </div>
        </NullWrapper>
    )
}

export function nodePendRenderer() {
    return (
        <NullWrapper>
            <TimeSelect item="PEND" theme="NODE" onClusterChange={this.handleClusterChange} onTimeChange={this.handleTimeChange}/>
            <div className="shadow-sm p-3 mb-5 bg-white rounded mt-5">
                <LineChart title={"节点排队信息"} yAxisName={"数目"} formatter={formatter}
                           url="/billing/api/node/pend/info"
                           cluster={this.state.cluster} partition={this.state.partition}
                           start={this.state.start} end={this.state.end}/>
            </div>
            <div className="shadow-sm p-3 mb-5 bg-white rounded mt-5">
                <LineChart title={"作业平均排队时间"} yAxisName={"时间（秒）"} formatter={formatter}
                           url="/billing/api/job/pend-time/info"
                           cluster={this.state.cluster} partition={this.state.partition}
                           start={this.state.start} end={this.state.end}/>
            </div>
        </NullWrapper>
    )
}

export function nodeUtilizationRenderer() {
    return (
        <NullWrapper>
            <TimeSelect item="UTILIZATION" theme="NODE" onClusterChange={this.handleClusterChange} onTimeChange={this.handleTimeChange}/>
            <div className="shadow-sm p-3 mb-5 bg-white rounded mt-5">
                <LineChart title={"节点利用率信息"} yAxisName={"百分比（％）"} formatter={formatter}
                           url="/billing/api/node/utilization/info"
                           cluster={this.state.cluster} partition={this.state.partition}
                           start={this.state.start} end={this.state.end}/>
            </div>
        </NullWrapper>
    )
}