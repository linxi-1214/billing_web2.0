/**
 * Created by wangxb on 18/3/29.
 */
import React, { Component } from 'react';
import './bootstrap4.0_css/bootstrap.min.css'

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{marginBottom: "15px"}}>
                <a className="navbar-brand" href="#">
                    <img src={process.env.PUBLIC_URL + "/paratera.svg"} style={{height: "30px"}} />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">数据校验 <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Navbar;