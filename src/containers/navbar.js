/**
 * Created by wangxb on 18/3/29.
 */
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import logoUrl from 'images/paratera.svg';

class Navbar extends Component {
    render() {
        const role = localStorage.getItem('role');
        const user = localStorage.getItem('loginUser');
        let list = [];
        if (role != null) {
            list.push(<NavLink exact activeClassName="active" className="nav-link" to="/report/query">机时报告</NavLink>);
        }
        if (role == 'op' || role == 'admin') {
            list.push(<NavLink exact activeClassName="active" className="nav-link" to="/node">节点信息</NavLink>);
            list.push(<NavLink exact activeClassName="active" className="nav-link" to="/customer">客户管理</NavLink>);
        }
        if (role == 'dev') {
            list.push(<NavLink exact activeClassName="active" className="nav-link" to="/admin">管理员接口</NavLink>)
        }
        const listItems = list.map((item) => <li className="nav-item">{item}</li>);
        let loginNav = <ul className="navbar-nav ml-auto mr-5 mt-2 mt-lg-0">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="fa fa-user"></span> Anonymous
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <Link to="/login" className="dropdown-item"><span className="fa fa-sign-in-alt"></span> Login</Link>
                    </div>
                </li>
        </ul>;
        if (user != null) {
            loginNav = <ul className="navbar-nav ml-auto mr-5 mt-2 mt-lg-0">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="fa fa-user"></span> {user}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <Link to="/logout" className="dropdown-item"><span className="fa fa-sign-out-alt"></span> Logout</Link>
                    </div>
                </li>
            </ul>;
        }
        console.log(logoUrl);
        return (
            <nav className="navbar navbar-expand-md navbar-light bg-light" style={{marginBottom: "15px"}}>
                <a className="navbar-brand" href="#">
                    <img src={logoUrl}/>
                </a>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        {listItems}
                    </ul>
                    {loginNav}
                </div>
            </nav>
        )
    }
}

export default Navbar;