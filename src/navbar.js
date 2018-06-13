/**
 * Created by wangxb on 18/3/29.
 */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light bg-light" style={{marginBottom: "15px"}}>
                <a className="navbar-brand" href="#">
                    <img src={process.env.PUBLIC_URL + "/paratera.svg"}/>
                </a>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink exact activeClassName="active" className="nav-link" to="/report">机时报告</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact activeClassName="active" className="nav-link" to="/customer">客户管理</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact activeClassName="active" className="nav-link" to="/node">节点信息</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact activeClassName="active" className="nav-link" to="/admin">管理员接口</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;