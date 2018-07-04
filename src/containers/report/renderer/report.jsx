import React, {Component} from 'react'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import { reportModules } from 'containers/report/modules'
import {LineChart, VBarChart} from 'libs/charts'

import logoUrl from 'images/paratera.svg'


const URLSearchParams = require('url-search-params');
const chineseIndex = ['一', '二', '三', '四', '五'];
const reportTypes = { days: '日', months: '月', years: '年' };
const contractTypes = {'Stored': '预付费', 'Duration': '包时长', 'Node': '包节点'};
const businessTypes = {'Machine-Time': '机时合同', 'Disk': '磁盘合同'};


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
                                    <li key={i}>
                                        <h4>
                                            {chineseIndex[i]}、
                                            <a href={'#module' + item.key}>{item.label}</a>
                                        </h4>
                                        <ol>
                                            {item.children.map((item, i) => {
                                                return (
                                                    <li key={i}>
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

        let label = item['label'];
        if (item['name'] == 'detail_cpu') {
            label += '(' + this.state.reportDateRange + ')'
        } else if (item['key'] == '3_2' && this.state.users.length <= 1) {
            return
        }
        return (
            <li className="module-item" key={i}>
                <a id={'module' + item.key}></a>
                <h3>{i + 1}. {label} </h3>
                {renderModuleItem.call(this, item)}
            </li>
        )
    }.bind(this));
}

function renderModuleItem(module) {
    let {uid, start, end} = this.state;
    switch (module.name) {
        case 'overview_contract':
            return <ContractRecord uid={uid}/>;
        case 'overview_cpu':
            return <CPUUsageBar uid={uid} start={start} end={end} />;
        default:
            return <ContractRecord uid={uid}/>;

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
                return <div>
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
                                <tr key={ind + '_' + i}>
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

//2.1 总机时情况
class CPUUsageBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {uid, start, end} = this.props;

        let data = {uid: uid, start: start, end: end};

        return (
            <div className="shadow-sm p-3 mb-5 bg-white rounded mt-5">
                <LineChart title={"费用总览"} yAxisName={"元"} formatter={formatter}
                           url="/billing/api/usage/overview" requestData={data}
                />
            </div>
        )
    }
}

//2.2 用户使用机时情况
function renderSection2_2() {
    const { users } = this.state
    return users.map((user, i) => (
        <ReportLine
            ref={'module_reportbar_2_2_' + (i + 1)}
            key={i}
            style={{ height: 300 }}
            chartTitle={user.username + '(' + (sccMap[user.center] || user.center) + ')'}
            xLabelKey="displayDate"
            valFmtType="time_h"
            yName="核时"
            tooltip={true}
            legend={true}
            series={user.usedPerDaySeries}
            data={user.usedPerDay} />
    ))
}

//2.3 磁盘使用情况
function renderSection2_3() {
    const { reportType } = this.props.location.query
    let {
        diskUsed,
        diskInfo,
        diskSeries
    } = this.state
    return (
        <div>
            <div className="row" ref='module_reportbar_2_3_1'>
                {diskInfo.length > 0 ?
                    <ReportBar2
                        //ref='module_reportbar_2_3_1'
                        chartTitle="磁盘容量使用情况"
                        style={{ height: 350 }}
                        xLabelKey={["partition", "username"]}
                        fmtType="flow_mb"
                        xName="分区名称"
                        yName="容量/GB"
                        tooltip={true}
                        legend={true}
                        series={diskSeries}
                        data={diskInfo} />
                    :
                    <div>
                        <div className="diskTitle">磁盘容量使用情况</div>
                        <div style={{ "textAlign": "center" }}>暂无数据</div>
                    </div>
                }

            </div>
            <div className="row" ref='module_reportbar_2_3_2'>
                <div className="diskDayTitle">各个业务单磁盘天数使用情况(天)</div>
                {diskUsed.length > 0 ?
                    <ul className="list-unstyled diskDayList">
                        {diskUsed.map((disk, i) => {
                            return (
                                <li key={i}>
                                    <ReportPie1
                                        style={{ height: 250 }}
                                        chartTitle="磁盘天数"
                                        data={diskUsed[i]}
                                    />
                                </li>
                            )
                        })}
                    </ul> :
                    <div style={{ "textAlign": "center" }}>暂无数据</div>}
            </div>
        </div>
    )
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
