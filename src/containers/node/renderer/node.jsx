import React, {Component} from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import { Button, Modal, ModalHeader, ModelBody, Label, Input, Form, FormGroup, Col } from 'reactstrap';
import { WrappedDateRangePicker } from 'libs/dates';
import { AsyncSelect } from 'libs/dropdown';

const qs = require('qs');
const moment = require('moment');
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
                <AsyncSelect id="cluster-select" name="cluster" onChange={this.handleClusterChange}
                             labelKey="name" valueKey="name"
                             url="/billing/api/cluster/list"
                />
                </div>
                <div className="col">
                <AsyncSelect id="cluster-partition-select"  onChange={this.handleChange} name="partition"
                             labelKey="partition" valueKey="partition" updateKey={this.state.cluster}
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
        let momentObj = moment(now);
        let end = momentObj.format('YYYY-MM-DD');
        let start = momentObj.subtract(1, 'days').format('YYYY-MM-DD');
        this.state = {
            btn_selected: '1',
            start: start, end: end
        };
        this.handleTimeButtonClick = this.handleTimeButtonClick.bind(this);
        this.handleClusterPartitionChange = this.handleClusterPartitionChange.bind(this);
    }

    handleTimeButtonClick(event) {
        const target = event.target;
        const time_range = target.value;
        let start = this.state.start_day;
        let end = this.state.end_day;

        if (time_range != 'all') {
            let now = new Date();
            let momentObj = moment(now);
            end = momentObj.format('YYYY-MM-DD');
            start = momentObj.subtract(parseInt(time_range), 'days').format('YYYY-MM-DD');
        } else {
            start = null;
            end = null;
        }

        this.setState({btn_selected: time_range, start: start, end: end });
        this.props.onTimeChange(start, end);

        event.preventDefault();
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
                        <Button color="primary" value="1" className={classnames("ml-5", {'btn-outline-primary': this.state.btn_selected != '1'})} onClick={this.handleTimeButtonClick}>今天</Button>
                        <Button color="primary" value="7" className={classnames("ml-3", {'btn-outline-primary': this.state.btn_selected != '7'})} onClick={this.handleTimeButtonClick}>7天</Button>
                        <Button color="primary" value="30" className={classnames("ml-3", {'btn-outline-primary': this.state.btn_selected != '30'})} onClick={this.handleTimeButtonClick}>30天</Button>
                        <Button color="primary" value="all" className={classnames("ml-3", {'btn-outline-primary': this.state.btn_selected != 'all'})} onClick={this.handleTimeButtonClick}>全部</Button>
                    </div>
                    <div className="col-3">
                        <WrappedDateRangePicker onTimeChange={this.props.onTimeChange}
                                                start={this.state.start} end={this.state.end}
                                                className="ml-2 bg-white"/>
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
                                <AsyncSelect id="cluster-select" name="cluster"
                                               labelKey="name" valueKey="name"
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