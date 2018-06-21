import React, {Component} from 'react';
import axios from 'axios';
import Select from 'react-select';
import cookie from 'react-cookies';
import { Button, Modal, ModalHeader, ModelBody, Label, Input } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const qs = require('qs');
const classnames = require('classnames');

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
                <div className="col-sm-3 input-group-sm">
                    <WrapperSelect id="cluster-user-select"  onChange={this.handleChange} name="user"
                                   labelName="username" valueName="username" option_key={this.state.cluster}
                                   url="/billing/api/cluster/user/list?for=bind"
                    />
                </div>
            </NullWrapper>
        )
    }
}

class RoleSetting extends Component {
    constructor(props) {
        super(props);

        this.setMasterUser = this.setMasterUser.bind(this);
        this.setPayUser = this.setPayUser.bind(this);
        this.userSetting = this.userSetting.bind(this);
    }

    userSetting(data) {
        axios({
                url: '/billing/api/group/user/setting',
                method: 'post',
                data: qs.stringify(data),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(response => {
                    if (response.status == '200') {
                        this.props.refresh('group', this.props.gid)
                    }
                });
    }

    setMasterUser() {
        let uid = this.props.uid;
        if (this.props.isMasterUser)
            uid = 'null';

        let data = {gid: this.props.gid, muid: uid, csrfmiddlewaretoken: cookie.load('csrftoken')};

        this.userSetting(data)
    }

    setPayUser() {
        let uid = this.props.uid;
        if (this.props.isPayUser)
            uid = 'null';

        let data = {gid: this.props.gid, puid: uid, csrfmiddlewaretoken: cookie.load('csrftoken')};

        this.userSetting(data)
    }

    render() {
        return (
            <NullWrapper>
                <button type="button" className="btn btn-sm btn-outline-warning"  onClick={this.setMasterUser}>{this.props.isMasterUser ? '取消主账号' : '设为主账号'}</button>
                <button type="button" className="btn btn-sm btn-outline-success ml-2" onClick={this.setPayUser}>{this.props.isPayUser ? '取消付费账号' : '设为付费账号'}</button>
            </NullWrapper>
        )
    }
}

class UserRow extends Component {
    constructor(props) {
        super(props);
        this.removeUserFromGroup = this.removeUserFromGroup.bind(this);
        this.unbindUser = this.unbindUser.bind(this);
    }

    removeUserFromGroup() {
        this.props.onRemoveUser(this.props.groupId, this.props.userId);
    }

    unbindUser() {
        if (this.props.clusterUser != null) {
            let _m = this.props.clusterUser.match(/^\(([^()]+)\)(.+)$/);
            if (_m != null && _m.length == 3) {
                let cluster = _m[1];
                let username = _m[2];
                this.props.onUnbind(this.props.userId, cluster, username);
            }
        }
    }

    render() {
        let user_info = this.props.userInfo;
        let master_class = classnames("fas fa-chess-queen text-warning ml-2");
        let pay_class = classnames("fas fa-money-check-alt text-success ml-2");
        return (
            <tr>
                { user_info != null &&
                <td rowSpan={user_info.cluster_users.length || 1}>
                    {user_info.name || 'N/A'}
                    {user_info.is_master_user && (<span><i className={master_class} title="主账号"></i></span>)}
                    {user_info.is_pay_user && (<span><i className={pay_class} title="付费账号"></i></span>)}
                    <Button color="secondary" size="sm" className="float-right" outline onClick={this.removeUserFromGroup}>
                        <span className="fas fa-unlink"></span>
                    </Button>
                </td>
                }
                <td>{this.props.clusterUser == null ? 'N/A' : (
                    <NullWrapper>
                        {this.props.clusterUser}
                        <Button color="secondary" size="sm" className="float-right" outline onClick={this.unbindUser}>
                            <span className="fas fa-unlink"></span>
                        </Button>
                    </NullWrapper>
                    )}
                </td>
                { user_info != null &&
                <td rowSpan={user_info.cluster_users.length || 1}>
                    <RoleSetting isPayUser={user_info.is_pay_user}
                                 isMasterUser={user_info.is_master_user}
                                 refresh={this.props.refresh}
                                 gid={this.props.groupId}
                                 uid={this.props.userId}
                                 disabled={this.props.userId != undefined && this.props.groupId != undefined}
                    />
                </td>
                }
            </tr>
        )
    }
}

class UnbindModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
    return (
        <Modal isOpen={this.props.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>{this.props.title}</ModalHeader>
          <ModalBody>
            <Label for="unbindTime">Password</Label>
            <Input type="text" name="btime" id="unbindTime" placeholder="password placeholder" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>{'确 定'}</Button>
            <Button color="secondary" onClick={this.toggle}>{'取 消'}</Button>
          </ModalFooter>
        </Modal>
    );
  }
}

class GroupTable extends Component {
    constructor(props) {
        super(props);

        this.state = {data: null};
        this.refresh = this.refresh.bind(this);
        this.unbind = this.unbind.bind(this);
        this.removeUserFromGroup = this.removeUserFromGroup.bind(this);
    }

    refresh(type, value) {
        let data = {type: type, value: value};

        axios({
            url: '/billing/api/user/detail',
            method: 'get',
            params: data,
        })
            .then(response => {
                this.setState({data: response.data});
            });
    }

    unbind(uid, cluster, username) {
        let params = {uid: uid, cluster: cluster, username: username, csrfmiddlewaretoken: cookie.load('csrftoken')};

        axios({
            url: '/billing/api/user/unbinding',
            method: 'post',
            data: qs.stringify(params)
        })
            .then(response => {
                this.refresh('puser', uid)
            })
    }

    removeUserFromGroup(gid, uid) {
        let params = {gid: gid, uid: uid, csrfmiddlewaretoken: cookie.load('csrftoken')}

        axios({
            url: '/billing/api/group/user/deletion',
            method: 'post',
            data: qs.stringify(params)
        })
            .then(response => {
                this.refresh('group', gid)
            })
    }

    render() {
        let table_data = this.state.data || this.props.data;
        if (table_data == null)
            return <table className="table table-bordered">
                <thead>
                <tr>
                    <th>组织</th>
                    <th>并行账号</th>
                    <th>超算账号</th>
                    <th>操作</th>
                </tr>
                </thead>
            </table>;

        /*
            this.props.data = {
                "group": {"name": "xxxx"},
                "users": {
                    user_id: {
                        "name": "xxxx", "is_pay_user": true, "is_master_user": true, "cluster_users": []
                    }
                },
            }
        */
        let user_info = null;
        let cluster_user_len = 0;
        var total_user_rows = Object.keys(table_data.users).map(user_id => {
            let user_cluster_user_len = 0;
            user_info = table_data.users[user_id];
            if (user_info.cluster_users.length == 0) {
                cluster_user_len += 1;
                return <UserRow key={user_id} userInfo={user_info} refresh={this.refresh}
                                onUnbind={this.unbind} onRemoveUser={this.removeUserFromGroup}
                                groupId={table_data.group.id} userId={user_id} />
            }
            return user_info.cluster_users.map(cluster_user => {
                cluster_user_len += 1;
                if (user_cluster_user_len == 0) {
                    user_cluster_user_len = 1;
                    return <UserRow key={cluster_user} userInfo={user_info}
                                    onUnbind={this.unbind} onRemoveUser={this.removeUserFromGroup}
                                    refresh={this.refresh} clusterUser={cluster_user}
                                    groupId={table_data.group.id} userId={user_id}/>;
                } else
                    return <UserRow key={cluster_user} clusterUser={cluster_user}
                                    onUnbind={this.unbind} onRemoveUser={this.removeUserFromGroup}
                                    groupId={table_data.group.id} userId={user_id}/>;
            });
        });

        return (
            <table className="table table-bordered">
                <thead>
                <tr><th>组织</th><th>并行账号</th><th>超算账号</th><th>操作</th></tr>
                </thead>
                {cluster_user_len <= 1 ?
                    <tbody>
                    <tr>
                        <td >{table_data.group.name || 'N/A'}</td>
                        {total_user_rows.length > 0 ? total_user_rows : (<NullWrapper><td></td><td></td><td></td></NullWrapper>)}
                    </tr>
                    </tbody>
                    :
                    <tbody>
                    <tr>
                        <td rowSpan={cluster_user_len+1}>{table_data.group.name || 'N/A'}</td>
                    </tr>
                    {total_user_rows}
                    </tbody>
                }
            </table>
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
                data: qs.stringify({gname: this.state.group, csrfmiddlewaretoken: cookie.load('csrftoken')}),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
                .then(response => {
                    if (response.status == '200') {
                        this.props.onFetchGroupInfo('group', response.data.group_id)
                    }
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
        this.setState({[state]: value});
        if (state == 'gid')
            this.props.onFetchGroupInfo('group', value);
        if (state == 'uid')
            this.props.onFetchGroupInfo('puser', value);
    }

    handleSubmit(event) {
        axios({
            url: '/billing/api/group/user/join',
            method: 'post',
            data: qs.stringify({
                gid: this.state.gid,
                uid: this.state.uid,
                csrfmiddlewaretoken: cookie.load('csrftoken')
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
            .then(response => {
                    if (response.status == '200')
                        this.props.onFetchGroupInfo('group', this.state.gid)
                });

        event.preventDefault();
    }

    render() {
        return (
            <form>
                <div className="form-group row p-3 mb-2 bg-light text-black rounded">
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">组织</label>
                    <div className="col-sm-4">
                        <WrapperSelect  id="group-select" name="gid" onChange={this.handleSelectChange}
                                        labelName="name" valueName="group_id"
                                        url="/billing/api/group/list"
                        />
                    </div>
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">并行账号</label>
                    <div className="col-sm-4">
                        <WrapperSelect id="para-user-select" onChange={this.handleSelectChange} name="uid"
                                       labelName="name" valueName="user_id"
                                       url="/billing/api/user/list"
                        />
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
        this.setState({[state]: value});
        if (state == 'uid')
            this.props.onFetchGroupInfo('puser', value);
        if (state == 'user')
            this.props.onFetchGroupInfo('cuser', "(" + this.state.cluster + ")" + value);
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
                if (response.status == '200') {
                    this.props.onFetchGroupInfo('puser', this.state.uid)
                }
            });

        event.preventDefault();
    }
    render() {
        return (
            <form>
                <div className="form-group row p-3 mb-2 bg-light text-black rounded">
                    <label htmlFor="cluster" className="col-sm-1 col-form-label">并行账号</label>
                    <div className="col-sm-3">
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
        <AddGroupForm onFetchGroupInfo={this.fetchGroupInfo}/>
        <hr />
        <AddGroupUserForm onFetchGroupInfo={this.fetchGroupInfo}/>
        <hr />
        <UserBindForm onFetchGroupInfo={this.fetchGroupInfo}/>
        <hr />
        <GroupTable data={this.state.table_data} onFetchGroupInfo={this.fetchGroupInfo}/>
    </div>
    )
}

export function queryFormRenderer() {
    return (
        <NullWrapper>
            <form>
                <div className="form-group row">
                    <label className="col-sm-1 col-form-label">查询</label>
                    <div className="col-sm-2">
                        <Select
                            id="query-type-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleTypeChange}
                            autoFocus
                            simpleValue
                            clearable={true}
                            name="query_type"
                            options={this.state.type_options}
                            value={this.state.query_type}
                            searchable={true}
                        />
                    </div>
                    <div className="col-sm-5">
                        <Select
                            id="query-value-select"
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            onChange={this.handleValueChange}
                            autoFocus
                            simpleValue
                            clearable={true}
                            name="query_value"
                            options={this.state.value_options}
                            value={this.state.query_value}
                            searchable={true}
                        />
                    </div>
                    <div className="col-sm-2">
                        <button type="submit" onClick={this.onSubmit} className="btn btn-outline-primary btn-block">查 询</button>
                    </div>
                </div>
            </form>
            <GroupTable data={this.state.table_data} />
        </NullWrapper>
    )
}
