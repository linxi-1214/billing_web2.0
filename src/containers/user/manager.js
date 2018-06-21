import React, { Component } from 'react';
import axios from 'axios';
import { bindFormRenderer, queryFormRenderer } from 'containers/user/renderer/manager';
import 'react-select/dist/react-select.css';

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
            value_options: null,
            query_type: null, query_value: null,
            table_data: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.changeOptions = this.changeOptions.bind(this);
    }

    changeOptions(origin_options, label_name, value_name) {
        var options = [];
        if (!(origin_options instanceof Array))
            Object.keys(origin_options).map(key => {
                origin_options[key].map(option => {
                    options.push({
                        'label': "(" + key + ")" + option[label_name],
                        'value': "(" + key + ")" + option[value_name]
                    });
                });
            });
        else
            options = origin_options.map(option =>{
                return {'label': option[label_name], 'value': option[value_name]};
            });

        return options;
    }

    handleTypeChange(selectedOption) {
        this.setState({query_type: selectedOption});
        let url = '/billing/api/group/list';
        let label_name = 'name', value_name = 'group_id';

        if (selectedOption == 'puser') {
            url = '/billing/api/user/list';
            label_name = 'name';
            value_name = 'user_id';
        } else if (selectedOption == 'cuser') {
            url = '/billing/api/cluster/user/list';
            label_name = 'username';
            value_name = 'username';
        }

        axios({
            url: url, method: 'get'
        })
            .then(response => {
                this.setState({value_options: this.changeOptions(response.data, label_name, value_name)})
            });
    }

    handleValueChange(selectedOption) {
        this.setState({query_value: selectedOption})
    }

    onSubmit(e) {
        let data = {
            type: this.state.query_type,
            value: this.state.query_value
        };

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
        let data = {type: type, value: value};

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