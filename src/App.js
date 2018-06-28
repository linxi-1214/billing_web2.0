import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import NavBar from 'containers/navbar';
import UserManagePills from 'containers/user/manager';
import NodeInfoPills from 'containers/node/node';
import Login, { Logout } from 'containers/login/login';

class EnsureHasLoginContainer extends Component {
    render() {
        console.log('reload');
        let loginUser = localStorage.getItem('loginUser');

        if (loginUser == null)
            return <Redirect to="/login" />;
        else
            return this.props.children;
    }
}

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <Route path="/login" component={Login} />
                    <EnsureHasLoginContainer>
                        <Route path="/customer" component={UserManagePills} />
                        <Route path="/logout" component={Logout} />
                        <Route path="/node" component={NodeInfoPills} />
                    </EnsureHasLoginContainer>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
