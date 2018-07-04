import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import NavBar from 'containers/navbar';
import UserManagePills from 'containers/user/manager';
import NodeInfoPills from 'containers/node/node';
import ReportFormPills from 'containers/report/queryform';
import ReportDetailForm from 'containers/report/report';

import Login, { Logout } from 'containers/login/login';

class EnsureHasLoginContainer extends Component {
    render() {
        let loginUser = localStorage.getItem('loginUser');

        if (loginUser == null)
            return <Redirect to="/login" />;
        else
            return this.props.children;
    }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <Route path="/login" component={Login} />
                    <EnsureHasLoginContainer>
                        <Switch>
                            <Route path="/customer" component={UserManagePills} />
                            <Route path="/logout" component={Logout} />
                            <Route path="/node" component={NodeInfoPills} />
                            <Route path="/report/query" exact={true} component={ReportFormPills} />
                            <Route path="/report/detail" component={ReportDetailForm} />
                            <Route component={NoMatch} />
                        </Switch>
                    </EnsureHasLoginContainer>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
