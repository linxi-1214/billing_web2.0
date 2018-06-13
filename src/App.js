import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import NavBar from './navbar';
import UserManagePills from './user-manager';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <Route path="/customer" component={UserManagePills} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
