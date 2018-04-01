import React, { Component } from 'react';
import axios from 'axios';
import { Tabs, Tab } from 'react-bootstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class Tr extends Component {
    constructor(props) {
        super(props);
        this.state = props.data;
        this.state['className'] = '';

        this.balanceHandle = this.balanceHandle.bind(this);
        this.ignoreHandle = this.ignoreHandle.bind(this);
    }

    balanceHandle() {
        var qs = require('qs');

        axios({
            url: '/api/manager/account/balance/',
            method: 'post',
            data: qs.stringfy(this.props.data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        db_data: this.state.check_data,
                        className: 'table-success'
                    });
                }
            });
    }

    ignoreHandle() {
        this.setState({
            className: 'table-warning'
        })
    }

    render() {
        return (
            <tr className={
                this.state.className === '' ?
                this.state.db_data === this.state.check_data ? 'table-success' : 'table-danger' : this.state.className
            }>
                <td>{this.state.collect_day}</td>
                <td>{this.state.partition}</td>
                <td>{this.state.db_data}</td>
                <td>{this.state.check_data}</td>
                <td>{this.state.check_data - this.state.db_data}</td>
                <td>
                    <button type="button" className="btn btn-info btn-sm" onClick={this.balanceHandle}>平 账</button>&nbsp;&nbsp;
                    <button type="button" className="btn btn-warning btn-sm" onClick={this.ignoreHandle}>忽 略</button>
                </td>
            </tr>
        )
    }
}


class CheckForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "/api/manager/cpu-check/",
            user_list: [],
            selectedOption: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount() {
        axios({
            url: '/api/manager/para-user/list/',
            method: 'get',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => {
                this.setState({user_list: response.data})
            });
    }

    handleSelectChange(selectedOption) {
        this.setState({
            selectedOption: selectedOption
        })
    }

    onSubmit(e) {
        var cluster = document.getElementById("cluster").value;
        var cluster_user = document.getElementById("sc_user").value;
        var start_day = document.getElementById("start_date").value;
        var end_day = document.getElementById("end_date").value;

        const data = {
            cluster: cluster,
            cluster_user: cluster_user,
            start_day: start_day,
            end_day: end_day
        };

        var qs = require('qs');

        axios({
            url: this.state.url,
            method: 'post',
            data: qs.stringify(data),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => {
                this.props.onSubmit(response.data);
            });

        e.preventDefault();
    }

    render() {
        const selectedParaUser = this.state.selectedOption;
        return (
            <form>
                <div className="form-group row">
                    <label htmlFor="cluster" className="col-sm-2 col-form-label">并行账号</label>
                    <div className="col-sm-8">
                        <Select
                            id="para-user-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleSelectChange}
                            placeholder="Select paratera user ..."
                            autoFocus
                            simpleValue
                            clearable={true}
                            name="paratera_user"
                            options={this.state.user_list}
                            value={selectedParaUser}
                            searchable={true}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="cluster" className="col-sm-2 col-form-label">查询超算</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="cluster" />
                    </div>
                    <label htmlFor="sc_user" className="col-sm-2 col-form-label">查询用户</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="sc_user" />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="start_date" className="col-sm-2 col-form-label">日期范围</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="start_date" name="start_date" />
                    </div>
                    <label htmlFor="start_date" className="col-sm-2 col-form-label">至</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="end_date" name="end_date" />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                        <button type="submit" onClick={this.onSubmit} className="btn btn-primary">查 询</button>
                    </div>
                </div>
            </form>
        )
    }
}

class CheckTable extends Component {
    render() {
        const data = this.props.data;
        // Example:
        // {
        //     "p_cfd_01(1232)": {
        //         "2018-01-01": {
        //             "cluster_id": "GUANGZHOU",
        //             "cluster_user_id": 1232,
        //             "partition": [
        //                 {
        //                     "name": "paratea",
        //                     "db_data": 12423,
        //                     "check_data": 12423
        //                 }
        //             ]
        //         }
        //     }
        // }

        var row_data_list = [];

        Object.keys(data).map((collect_day) => {
            data[collect_day]['partition'].map((partition_info) => {
                    var row_data = {
                        "cluster_user_id": data[collect_day]['cluster_user_id'],
                        "collect_day": collect_day
                    };
                    row_data['partition'] = partition_info['name'];
                    row_data['db_data'] = partition_info['db_data'];
                    row_data['check_data'] = partition_info['check_data'];
                    row_data_list.push(row_data)
                }
            );
        });

        return (
            <table className={this.props.class}>
                <thead>
                    <tr>
                        <td>校验日期</td>
                        <td>分区</td>
                        <td>现存机时(S)</td>
                        <td>校验机时(S)</td>
                        <td>数据差</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                {row_data_list.map((_row) =>
                    <Tr key={_row.collect_day + _row.partition} data={_row}/>
                )}
                </tbody>
            </table>
        )
    }
}

class SumTable extends Component {
    render() {
        const data = this.props.data;
        // Example:
        // {
        //     "p_cfd_01(1232)": {
        //         "cluster_id": "GUANGZHOU",
        //         "checked": {
        //             "partition": {
        //                 "paratera": 12423,
        //                 "work": 232223
        //             },
        //             "total": 244646
        //         },
        //         "db": {
        //             "partition": {
        //                 "paratera": 12423,
        //                 "work": 232223
        //             },
        //             "total": 244646
        //         }
        //     }
        // }

        return (
            <table className={this.props.class}>
                <thead>
                    <tr>
                        <td>分区</td>
                        <td>现存机时汇总(S)</td>
                        <td>校验机时汇总(S)</td>
                        <td>数据相差(S)</td>
                    </tr>
                </thead>
                <tbody>
                {data.db !== undefined && Object.keys(data.db.partition).map((partition) => {
                    return (
                        <tr key={partition}>
                            <td>{partition}</td>
                            <td>{data.db['partition'][partition]}</td>
                            <td>{data.checked['partition'][partition]}</td>
                            <td>{data.checked['partition'][partition] - data.db['partition'][partition]}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
}


class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_data: {
                detail: {},
                summary: {}
            }
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(data) {
        this.setState({
            user_data: data
        });
        console.log(this.state.user_data);
    }

    render() {
        return (
            <div className="container">
                <div className="alert alert-secondary">
                    <CheckForm onSubmit={this.onSubmit}/>
                </div>
                <Tabs id={"user_cpu_summary"} defaultActiveKey={0}>
                    {Object.keys(this.state.user_data.summary).map((username, index) =>
                        <Tab key={username} eventKey={index} title={username}>
                            <SumTable class="table table-bordered" data={this.state.user_data.summary[username]}/>
                        </Tab>
                    )}
                </Tabs>
                <Tabs id={"user-cpu-detail"} defaultActiveKey={0}>
                    {Object.keys(this.state.user_data.detail).map((username, index) =>
                        <Tab key={username} eventKey={index} title={username}>
                            <CheckTable class="table table-bordered" data={this.state.user_data.detail[username]}/>
                        </Tab>
                    )}
                </Tabs>
            </div>
        )
    }
}


export {Page};
