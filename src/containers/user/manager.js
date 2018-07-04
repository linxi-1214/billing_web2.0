import React, { Component } from 'react';
import axios from 'axios';
import { bindFormRenderer, queryFormRenderer } from 'containers/user/renderer/manager';

const qs = require('qs');

class QueryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type_options: [
                {'label': '组织', 'value': 'group'},
                {'label': '并行用户', 'value': 'puser'},
                {'label': '超算用户', 'value': 'cuser'},
            ],
            query_type: null,
            query_value: {},
            table_data: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleTypeChange(name, selectedValue) {
        this.setState({
            updateKey: selectedValue,
            query_type: selectedValue,
        });
    }

    handleValueChange(name, selectedValue) {
        this.state.query_value[name] = selectedValue;
        this.setState({query_value: this.state.query_value})
    }

    onSubmit(e) {
        let data = {
            type: this.state.query_type
        };

        Object.keys(this.state.query_value).map(key => {
            data[key] = this.state.query_value[key]
        });

        axios({
            url: '/billing/api/user/detail',
            method: 'get',
            params: data,
        })
            .then(response => {
                this.setState({table_data: response.data});
            });

        e.preventDefault();
    }

    render() {
        return queryFormRenderer.bind(this)()
    }
}

class BindForm extends Component {
    constructor(props) {
        super(props);

        this.state = {table_data: null};
        this.fetchGroupInfo = this.fetchGroupInfo.bind(this);
    }

    fetchGroupInfo (type, value) {
        let data = {type: type};

        Object.keys(value).map(key => {
            data[key] = value[key]
        });

        axios({
            url: '/billing/api/user/detail',
            method: 'get',
            params: data,
        })
            .then(response => {
                this.setState({table_data: response.data});
            });
    }

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
                        <a className="nav-link active" id="v-pills-query-tab" data-toggle="pill" href="#v-pills-query"
                           role="tab" aria-controls="v-pills-query" aria-selected="true">绑定查询</a>

                        <a className="nav-link" id="v-pills-bind-tab" data-toggle="pill" href="#v-pills-bind"
                           role="tab" aria-controls="v-pills-bind" aria-selected="false">用户绑定</a>
                    </div>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-query" role="tabpanel"
                             aria-labelledby="v-pills-query-tab">
                             <QueryForm/>
                        </div>
                        <div className="tab-pane fade" id="v-pills-bind" role="tabpanel"
                             aria-labelledby="v-pills-bind-tab">
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