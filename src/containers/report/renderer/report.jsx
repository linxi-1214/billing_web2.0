import React, {Component} from 'react'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { reportModules } from 'containers/report/modules'
import {LineChart, VBarChart, HBarChart} from 'libs/charts'

import logoUrl from 'images/paratera.svg'

const moment = require('moment');

const URLSearchParams = require('url-search-params');
const chineseIndex = ['一', '二', '三', '四', '五'];
const reportTypes = { days: '日', months: '月', years: '年' };
const contractTypes = {'Stored': '预付费', 'Duration': '包时长', 'Node': '包节点'};
const businessTypes = {'Machine-Time': '机时合同', 'Disk': '磁盘合同'};

class NullWrapper extends Component {
    render() {
        return this.props.children;
    }
}

class CircleProgress extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <CircularProgress size={this.props.size}
                                 style={{ position: 'absolute', color: "#007bff", left: '50%', top: '50%', margin: '-25px 0 0 -25px' }} />
    }
}

// 目录
class Directory extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { isShowJobStat } = this.props;
        return (
            <div className="directory" ref="directory">
                <h1>目录</h1>
                <ul className="list-unstyled">
                    {
                        reportModules.map((item, i) => {
                            if (item.key != '3' || (item.key == '3' && isShowJobStat)) {
                                return (
                                    <li key={item.key}>
                                        <h4>
                                            {chineseIndex[i]}、
                                            <a href={'#module' + item.key}>{item.label}</a>
                                        </h4>
                                        <ol>
                                            {item.children.map((item, i) => {
                                                return (
                                                    <li key={item.key}>
                                                        <a href={'#module' + item.key}>{item.label}</a>
                                                    </li>
                                                )
                                            })}
                                        </ol>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            </div>
        )
    }
}

//报告详细内容
function renderBody() {
    const { isShowJobStat } = this.state;
    return reportModules.map(function (item, i) {
        if (item.key != '3' || (item.key == '3' && isShowJobStat)) {
            return (
                <li className="module-group" key={i}>
                    <a id={'module' + item.key}></a>
                    <h2>{chineseIndex[i]}、{item.label} </h2>
                    <ul className="list-unstyled">
                        {renderModules.call(this, item.children)}
                    </ul>
                </li>
            )
        }
    }.bind(this));
}

function renderModules(modules) {
    return modules.map(function (item, i) {
        if (item['key'] == '3_2' && this.state.users.length <= 1) {
            return
        }
        return (
            <li className="module-item" key={i}>
                <a id={'module' + item.key}></a>
                <h3>{i + 1}. {item.label} </h3>
                {renderModuleItem.call(this, item)}
            </li>
        )
    }.bind(this));
}

function renderModuleItem(module) {
    let {uid, start, end} = this.state;
    let month = moment(end).format('YYYY-MM');
    switch (module.name) {
        case 'overview_contract':
            return <ContractRecord uid={uid}/>;
        case 'overview_cpu':
            return <CPUUsageBar uid={uid} start={start} end={end} />;
        case 'detail_cpu':
            return <FlowingList uid={uid} month={month} onlyThisYear={0} />;
        case 'detail_cpu_bar':
            return <FlowingListBar uid={uid} month={month} onlyThisYear={0} />;
        default:
            return null;

        // case '2_1':
        //     return renderSection2_1.call(this);
        // case '2_2':
        //     return renderSection2_2.call(this);
        // case '2_3':
        //     return renderSection2_3.call(this);
        // case '3_1':
        //     return renderSection3_1.call(this);
        // case '3_2':
        //     return renderSection3_2.call(this);
    }
}

//1.1 充值记录
class ContractRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {contractRecord: {}}
    }

    componentDidMount() {
        let data = {uid: this.props.uid};
        axios({
            url: '/billing/api/contract/list',
            method: 'get',
            params: data,
        })
            .then(response => {
                this.setState({contractRecord: response.data});
            });
    }

    render () {
        let {contractRecord} = this.state;

        let circle = (
            <div className="position-relative container p-5">
                <CircleProgress size={40}/>
            </div>
        );
        let table = Object.keys(contractRecord).map((business, ind) => {
                return <div key={business + ind}>
                    <h4>{String.fromCharCode(97 + ind) + '. ' + businessTypes[business]}</h4>
                    <table className="table table-sm table-bordered">
                        <thead>
                        <tr>
                            <th>合同号</th>
                            <th>类型</th>
                            <th>签订金额(元)</th>
                            <th>余额(元)</th>
                            <th>赠送</th>
                            <th>签订时间</th>
                            <th>录入时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            contractRecord[business].contract_list && contractRecord[business].contract_list.map((record, i) =>
                                <tr key={business + ind + '-' + i}>
                                    <td>{record.contract_number}</td>
                                    <td>{contractTypes[record.type]}</td>
                                    <td>{(record.amount / 100).toFixed(2)}</td>
                                    <td>{(record.balance / 100).toFixed(2)}</td>
                                    <td>{record.is_present ? '是' : '否'}</td>
                                    <td>{record.signing_time}</td>
                                    <td>{record.record_time}</td>
                                </tr>)
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="2" className="border-right-0">
                                充值总额(元)：{(contractRecord[business].total_money / 100).toFixed(2)}
                            </td>
                            <td colSpan="2" className="border-left-0 border-right-0">
                                已使用(元)：{((contractRecord[business].total_money - contractRecord[business].total_balance) / 100).toFixed(2)}
                            </td>
                            <td colSpan="3" className="border-left-0">
                                当前余额(元)：{(contractRecord[business].total_balance / 100).toFixed(2)}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            }
        );

        return Object.keys(contractRecord).length == 0 ? circle : table;
    }
}

function formatter(params) {
    let fen = params.value[params.seriesName];
    let yuan = (parseInt(fen) / 100).toFixed(2);

    return yuan;
}

//1.2 总机时情况
class CPUUsageBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {uid, start, end} = this.props;

        let data = {uid: uid, start: start, end: end};

        return (
            <div className="shadow-sm p-3 bg-white rounded mt-5">
                <VBarChart title={"费用总览"} yAxisName={"元"} formatter={formatter}
                           url="/billing/api/user/usage/overview" requestData={data}
                />
            </div>
        )
    }
}

function monthCostRow(time_key, month_data) {
    let month_length = Object.keys(month_data).length;
    let has_contract = true;
    if (month_data.contract <= 0) {
        month_length -= 1;
        has_contract = false;
    }
    if (month_length == 1)
        month_length = 2;

    return (
        <NullWrapper>
            <tr>
                <td rowSpan={month_length}>{time_key}</td>
            </tr>
            {has_contract && (
                <tr>
                    <td colSpan="3" className="text-success text-right pr-3 pt-2x"> <h4>+{month_data.contract}</h4></td>
                </tr>
            )}
            {Object.keys(month_data).map(_uk => {
                    if (_uk == 'balance' || _uk == 'contract') {
                        return null;
                    }
                    return (
                        <tr>
                            <td>{_uk}</td>
                            <td>{month_data[_uk].costCpu}</td>
                            <td className="text-danger text-right pr-3">-{month_data[_uk].costMoney}</td>
                        </tr>
                    )
                }
            )}
            <tr>
                <td colSpan="4" className="font-weight-bold">当前结余：{month_data.balance}</td>
            </tr>
        </NullWrapper>
    )
}

// 流水单表格
class FlowingListTable extends Component {
    constructor(props) {
        // Example:
        // this.state.data = {
        //     "initBalance": 0,
        //     "2018-04-30": {
        //         "balance": 0,
        //         "paratera_14": {
        //             "costMoney": 0,
        //             "costCpu": 174648
        //         },
        //         "contract": 0
        //     },
        //     "2018-06-30": {
        //         "balance": 29167648,
        //         "paratera_14": {
        //             "costMoney": 15252,
        //             "costCpu": 0
        //         },
        //         "contract": 29182900
        //     }
        // }
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        let data = {uid: this.props.uid, month: this.props.month, oty: this.props.onlyThisYear};
        axios({
            url: '/billing/api/user/flowing-list',
            method: 'get',
            params: data
        })
            .then(response => {
                this.setState({data: response.data});
            });
    }

    render() {
        const { data } = this.state;

        return (
            <table className="table table-bordered table-sm table-hover">
                <thead>
                    <tr>
                    <th>截止日期</th>
                    <th>用户</th>
                    <th>当月使用机时</th>
                    <th>机时费明细（元)</th>
                    </tr>
                </thead>
                <tbody>
                {data == null ?
                    <tr>
                        <td colSpan="4">
                            <div className="position-relative container p-5">
                                <CircleProgress size={40}/>
                            </div>
                        </td>
                    </tr>
                    :
                    Object.keys(data).map(_k => {
                        if (_k == "initBalance") {
                            return (
                                <tr>
                                    <td colSpan="4" className="font-weight-bold">当前结余：{data[_k]}</td>
                                </tr>
                            )
                        } else {
                            return monthCostRow(_k, data[_k])
                        }
                    })
                }
                {data != null && Object.keys(data).length == 0 && <tr><td colSpan="4" className="text-center font-italic">目前没有消费</td></tr>}
                </tbody>
            </table>
        )
    }
}

//2.1 机时流水单
class FlowingList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FlowingListTable {...this.props} />
            </div>
        )
    }
}

//2.2 机时使用图例
class FlowingListBar extends Component {
    constructor(props) {
        // Example:
        // this.state.data = {
        //     "initBalance": 0,
        //     "2018-04-30": {
        //         "balance": 0,
        //         "paratera_14": {
        //             "costMoney": 0,
        //             "costCpu": 174648
        //         },
        //         "contract": 0
        //     },
        //     "2018-06-30": {
        //         "balance": 29167648,
        //         "paratera_14": {
        //             "costMoney": 15252,
        //             "costCpu": 0
        //         },
        //         "contract": 29182900
        //     }
        // }
        super(props);
        this.state = {
            data: {}
        }
    }

    parseData(origin_data) {
        // Example of origin_data:
        // {
        //     "initBalance": 0,
        //     "2018-04-30": {
        //         "balance": 0,
        //         "paratera_14": {
        //             "costMoney": 0,
        //             "costCpu": 174648
        //         },
        //         "contract": 0
        //     },
        //     "2018-06-30": {
        //         "balance": 29167648,
        //         "paratera_14": {
        //             "costMoney": 15252,
        //             "costCpu": 0
        //         },
        //         "contract": 29182900
        //     }
        // }

        let _dataSet = [];
        let _states = ['date'];
        Object.keys(origin_data).map(_tk => {
            if (_tk == "initBalance")
                return;

            let _data = {"date": _tk};
            Object.keys(origin_data[_tk]).map(_uk => {
                if (_uk == 'balance' || _uk == 'contract')
                    return;
                _data[_uk] = origin_data[_tk][_uk].costCpu;
                if (_states.indexOf(_uk) == -1)
                    _states.push(_uk);
            });
            _dataSet.push(_data);
        });

        return {"dataset": _dataSet, "states": _states}
    }

    render() {
        let data = {uid: this.props.uid, month: this.props.month, oty: this.props.onlyThisYear};

        return (
            <div className="shadow-sm p-3 bg-white rounded mt-5">
                <HBarChart title={"用户机时使用"} yAxisName={"核时"} stack="cputime"
                           url="/billing/api/user/flowing-list" requestData={data}
                           parseFunc={this.parseData} grid={{top: '20%'}}
                />
            </div>
        )
    }
}

//3.1 作业统计
function renderSection3Charts(item, title) {
    return [
        <div className="row" key={1} ref={title + "_row1"}>
            <div className="col-xs-12 col-sm-6">
                <ReportPie
                    style={{ height: 350 }}
                    chartTitle="各状态作业个数"
                    data={item.success ? [
                        { value: item.doneCounts, name: '已完成' },
                        { value: item.cancCounts, name: '取消' },
                        { value: item.failCounts, name: '失败' }
                    ] : []} />
            </div>
            <div className="col-xs-12 col-sm-6">
                <ReportPie
                    style={{ height: 350 }}
                    chartTitle="各状态作业核时(核时)"
                    data={item.success ? [
                        { value: item.doneSlothours, name: '已完成' },
                        { value: item.cancSlothours, name: '取消' },
                        { value: item.failSlothours, name: '失败' }
                    ] : []} />
            </div>
        </div>,
        <div className="row" key={2} ref={title + "_row2"}>
            <div className="col-xs-12 col-sm-6">
                <ReportPie
                    key={2}
                    style={{ height: 350 }}
                    chartTitle="作业类型Top10"
                    data={item.jobnameCounts} />
            </div>
            <div className="col-xs-12 col-sm-6">
                <ReportPie
                    key={3}
                    style={{ height: 350 }}
                    chartTitle="节点分布Top10"
                    data={item.nodesCounts} />
            </div>
        </div>
    ]
}
function renderSection3_1() {
    const { clusters } = this.state
    return clusters.map((cluster, i) => (
        <div key={i}>
            <h4 ref={'module_title_3_1_' + (i + 1)}>{cluster.displayName} 超算中心总计提交 {cluster.totalCounts || 'N/A'} 个作业，共计使用 {cluster.totalSlothours || 'N/A'} 核时。</h4>
            {renderSection3Charts(cluster, 'module_piechart_3_1_' + (i + 1))}
        </div>
    ))
}

//3.2 用户使用情况
function renderSection3_2() {
    const { users } = this.state
    return users.map((user, i) => {
        return (
            <div key={i}>
                <h4 ref={'module_title_3_2_' + (i + 1)}>用户 {user.username} ({sccMap[user.center] || user.center}) 提交 {user.totalCounts || 'N/A'} 个作业，共用 {user.totalSlothours || 'N/A'} 核时。</h4>
                {renderSection3Charts(user, 'module_piechart_3_2_' + (i + 1))}
            </div>
        )
    })
}

export function reportDetailRenderer() {
    const { isAllRequestsDone } = this.state;
    const { reportDateRange } = this.state;
    const searchParams = new URLSearchParams(this.props.location.search);
    const reportType = searchParams.get('reportType');

    return (
        !isAllRequestsDone ?
            <CircularProgress size={100} style={{ position: 'absolute', color: "#007bff", left: '50%', top: '50%', margin: '-25px 0 0 -25px' }} /> :
            <div className="report-content container-fluid" ref="container">
                <div className="cover" ref="cover">
                    <h1>机时增值服务{reportTypes[reportType]}报告</h1>
                    <h4 className="author">汇报人：并行科技</h4>
                    <h4 className="date">汇报日期：{reportDateRange}</h4>
                    <h3 className="company">北京并行科技股份有限公司</h3>
                    <div className="company-logo"><img src={logoUrl} /></div>
                </div>
                <Directory isShowJobStat={this.state.isShowJobStat}/>
                <ul className="list-unstyled content">
                    {renderBody.call(this)}
                </ul>

            </div>
    )
}
