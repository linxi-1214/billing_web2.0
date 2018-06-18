import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import cookie from 'react-cookies';

const qs = require('qs');

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

        console.log(origin_options);

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
            value={this.state.selectedOption}
            searchable={true}
        />
    }
}

class ClusterUserSelect extends Component {
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
                <label htmlFor="sc_cluster" className="col-sm-1 col-form-label">超算帐号</label>
                <div className="col-sm-2 input-group-sm">
                    <WrapperSelect id="cluster-select" name="cluster" onChange={this.handleClusterChange}
                                   labelName="name" valueName="name"
                                   url="/billing/api/cluster/list"
                    />
                </div>
                <div className="col-sm-2 input-group-sm">
                    <WrapperSelect id="cluster-user-select"  onChange={this.handleChange} name="user"
                                   labelName="username" valueName="username" option_key={this.state.cluster}
                                   url="/billing/api/cluster/user/list?for=bind"
                    />
                </div>
            </NullWrapper>
        )
    }
}

class AddGroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {group: null};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({group: event.target.value})
    }

    handleSubmit(event) {
        if (this.state.group != null) {
            axios({
                url: '/billing/api/group/creation',
                method: 'post',
                data: qs.stringify({gname: this.state.group}),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
                .then(response => {
                    if (response.status == '200')
                        alert('Add success.')
                })
        }
        event.preventDefault();
    }

    render() {
        return (
        <form>
            <div className="form-group row p-3 mb-2 bg-light text-black rounded">
                <label htmlFor="cluster" className="col-sm-1 col-form-label">组织</label>
                <div className="col-sm-9">
                    <input type="text" className="form-control" onChange={this.handleChange} id="cluster" aria-describedby="inputGroup-sizing-sm"/>
                </div>
                <div className="col-sm-2">
                    <button type="submit" onClick={this.handleSubmit} className="btn btn-sm btn-block btn-secondary">添 加</button>
                </div>
            </div>
        </form>
        )
    }

}

class AddGroupUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {gid: null, uid: null, is_pay_user: false, is_master: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleSelectChange(state, value) {
        this.setState({[state]: value})
    }

    handleSubmit(event) {
        axios({
            url: '/billing/api/group/user/join',
            method: 'post',
            data: qs.stringify({
                gid: this.state.gid,
                uid: this.state.uid,
                role: this.state.is_master ? 1 : 0
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
            .then(response => {
                    if (response.status == '200')
                        alert('Add success.')
                });

        if (is_pay_user)
            axios({
                url: '/billing/api/group/pay-user/setting',
                method: 'post',
                data: qs.stringify({
                    gid: this.state.gid, puid: this.state.uid
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(response => {
                    if (response.status == '200')
                        alert("Set pay user success.")
                });
        event.preventDefault();
    }

    render() {
        return (
            <form>
                <div className="form-group row p-3 mb-2 bg-light text-black rounded">
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">组织</label>
                    <div className="col-sm-3">
                        <WrapperSelect  id="group-select" name="gid" onChange={this.handleSelectChange}
                                        labelName="name" valueName="group_id"
                                        url="/billing/api/group/list"
                        />
                    </div>
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">并行账号</label>
                    <div className="col-sm-2">
                        <WrapperSelect id="para-user-select" onChange={this.handleSelectChange} name="uid"
                                       labelName="name" valueName="user_id"
                                       url="/billing/api/user/list"
                        />
                    </div>
                    <div className="col-sm-3">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name='is_pay_user' id="payUser" value="1" onChange={this.handleChange} />
                        <label className="form-check-label" htmlFor="payUser">付费帐号</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="masterUser" name="role" value="1" onChange={this.handleChange} />
                        <label className="form-check-label" htmlFor="inlineCheckbox2">管理员</label>
                    </div>
                    </div>
                    <div className="col-sm-2">
                        <button type="submit" onClick={this.handleSubmit} className="btn btn-sm btn-block btn-secondary">绑 定</button>
                    </div>
                </div>
            </form>
        )
    }

}

class UserBindForm extends Component {
    constructor(props) {
        super(props);
        this.state = {uid: null, cluster: null, user: null};
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});
    }

    handleSelectChange(state, value) {
        this.setState({[state]: value})
    }

    handleSubmit(event) {
        axios({
            url: '/billing/api/user/binding',
            method: 'post',
            data: qs.stringify({
                uid: this.state.uid,
                cluster: this.state.cluster,
                username: this.state.user,
                csrfmiddlewaretoken: cookie.load('csrftoken')
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
            .then(response => {
                if (response.status == '200')
                    alert('Add success.')
            });

        event.preventDefault();
    }
    render() {
        return (
            <form>
                <div className="form-group row p-3 mb-2 bg-light text-black rounded">
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">并行账号</label>
                    <div className="col-sm-4">
                        <WrapperSelect id="para-user-select" onChange={this.handleSelectChange} name="uid"
                                       labelName="name" valueName="user_id"
                                       url="/billing/api/user/list"
                        />
                    </div>
                    <ClusterUserSelect onChange={this.handleSelectChange}/>
                    <div className="col-sm-2">
                        <button type="submit" onClick={this.handleSubmit} className="btn btn-sm btn-block btn-secondary">绑 定</button>
                    </div>
                </div>
            </form>
        )
    }
}

export function bindFormRenderer() {
    return (
    <div>
        <AddGroupForm/>
        <hr />
        <AddGroupUserForm/>
        <hr />
        <UserBindForm/>
    </div>
    )
}

