import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { bindFormRenderer } from 'containers/user/renderer/manager';
import 'react-select/dist/react-select.css';

class QueryForm extends Component {
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
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">组织</label>
                    <div className="col-sm-9 input-group-sm">
                        <Select
                            id="group-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleSelectChange}
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
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">并行账号</label>
                    <div className="col-sm-3 input-group-sm">
                        <Select
                            id="para-user-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleSelectChange}
                            autoFocus
                            simpleValue
                            clearable={true}
                            name="paratera_user"
                            options={this.state.user_list}
                            value={selectedParaUser}
                            searchable={true}
                        />
                    </div>
                    <label htmlFor="sc_user" className="col-sm-1 col-form-label">超算</label>
                    <div className="col-sm-2 input-group-sm">
                        <Select
                            id="cluster-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleSelectChange}
                            autoFocus
                            simpleValue
                            clearable={true}
                            name="paratera_user"
                            options={this.state.user_list}
                            value={selectedParaUser}
                            searchable={true}
                        />
                    </div>
                    <label htmlFor="sc_user" className="col-sm-1 col-form-label">用户</label>
                    <div className="col-sm-2 input-group-sm">
                        <Select
                            id="cluster-user-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleSelectChange}
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
                    <div className="col-sm-10 input-group-sm">
                        <button type="submit" onClick={this.onSubmit} className="btn btn-outline-primary btn-block">查 询</button>
                    </div>
                </div>
            </form>
        )
    }
}

class BindForm extends Component {
    render() {
        return bindFormRenderer.bind(this)()
    }
}

class UserManagePills extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="offset-1"></div>
                <div className="col-2">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home"
                           role="tab" aria-controls="v-pills-home" aria-selected="true">绑定查询</a>
                        <a className="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile"
                           role="tab" aria-controls="v-pills-profile" aria-selected="false">用户绑定</a>
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                             aria-labelledby="v-pills-home-tab">
                             <QueryForm/>
                        </div>
                        <div className="tab-pane fade" id="v-pills-profile" role="tabpanel"
                             aria-labelledby="v-pills-profile-tab">
                            <BindForm/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default UserManagePills;