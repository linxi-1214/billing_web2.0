import React, { Component } from 'react';
import axios from 'axios';
import './bootstrap4.0_css/bootstrap.min.css'


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
            data: qs.stringify(this.props.data),
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
                <td>{this.state.username}</td>
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
            url: "/api/manager/cpu-check/"
        };
        this.onSubmit = this.onSubmit.bind(this);
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
        return (
            <form>
                <div className="form-group row">
                    <label htmlFor="cluster" className="col-sm-2 col-form-label">查询超算</label>
                    <div className="col-sm-3">
                        <input type="text" className="form-control" id="cluster" />
                    </div>
                    <label htmlFor="sc_user" className="col-sm-2 col-form-label">查询用户</label>
                    <div className="col-sm-5">
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
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         collect_day: [],
    //         cpu_data_db: [],
    //         cpu_data_checked: []
    //     }
    // }

    // componentDidMount() {
    //     this.setState({
    //         collect_day: ['2018-01-01', '2018-01-02'],
    //         cpu_data_db: [239882, 289323],
    //         cpu_data_checked: [291489, 289323]
    //     })
    // }
    //
    // componentWillUnmount() {
    //     this.setState({})
    // }

    render() {
        const data = this.props.data;

        return (
            <table className={this.props.class}>
                <thead>
                    <tr>
                        <td>校验日期</td>
                        <td>用户名</td>
                        <td>分区</td>
                        <td>现存机时(S)</td>
                        <td>校验机时(S)</td>
                        <td>数据差</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                {data.map((user_data) =>
                    <Tr key={user_data.collect_day + user_data.username + user_data.partition} data={user_data} />
                )}
                </tbody>
            </table>
        )
    }
}

class SumTable extends Component {
    render() {
        const data = this.props.summary_data;

        var db_total = 0;
        var check_total = 0;

        data.map((user_data) => {
            db_total += user_data.db_data_summary;
            check_total += user_data.check_data_summary;
        });

        return (
            <table className={this.props.class}>
                <thead>
                    <tr>
                        <td>用户名</td>
                        <td>分区</td>
                        <td>现存机时汇总(S)</td>
                        <td>校验机时汇总(S)</td>
                        <td>数据相差(S)</td>
                    </tr>
                </thead>
                <tbody>
                {data.map((user_data) => {
                    return (
                        <tr key={user_data.username + user_data.partition}>
                            <td>{user_data.username}</td>
                            <td>{user_data.partition}</td>
                            <td>{user_data.db_data_summary}</td>
                            <td>{user_data.check_data_summary}</td>
                            <td>{user_data.check_data_summary - user_data.db_data_summary}</td>
                        </tr>
                    )
                    }
                )}
                <tr>
                    <td></td>
                </tr>
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
                "summary_info": [],
                "data": []
            }
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(data) {
        this.setState({
            user_data: data
        })
    }

    render() {
        return (
            <div className="container">
                <div className="alert alert-secondary">
                    <CheckForm onSubmit={this.onSubmit}/>
                </div>
                <SumTable class="table table-bordered" summary_data={this.state.user_data.summary_info}/>
                <CheckTable class="table table-bordered" data={this.state.user_data.data}/>
            </div>
        )
    }
}


export {Page};
