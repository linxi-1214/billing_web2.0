/**
 * Created by wangxb on 18/6/14.
 */
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { login, pre_login, logout } from '../../actions/login'
import tplRender from './login.jsx'

const PropTypes = require('prop-types');


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            pwd: "",
            emailValid: true,
            pwdValid: true,
            btnLoginDisabled: false,
            btnLoginText: "登录"
        }
    }

    componentDidMount () {
        pre_login()
    }

    validateEmail(email) {
        //if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
        if (email == "") {
            this.setState({ emailValid: false });
            return false
        } else {
            this.setState({ emailValid: true });
            return true
        }
    }

    validatePwd(pwd) {
        if (pwd == "") {
            this.setState({ pwdValid: false });
            return false
        } else {
            this.setState({ pwdValid: true });
            return true
        }
    }

    validateLoginForm(email, pwd) {
        return this.validateEmail(email) && this.validatePwd(pwd)
    }

    emailChange(e) {
        var val = e.target.value;
        if (val == this.state.email) {
            return
        }

        this.setState({ email: val })
    }

    pwdChange(e) {
        var val = e.target.value;
        if (val == this.state.pwd) {
            return
        }

        this.setState({ pwd: val })
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email, pwd } = this.state;
        if (!this.validateLoginForm(email, pwd)) {
            return
        }

        this.setState({
            btnLoginDisabled: true,
            btnLoginText: "登录中..."
        });

        login(email, pwd)
            .then(function(response) {
                console.log(response.data);
                if (response.data.code != 0)
                    alert("Login Failed!");
                else {
                    localStorage.setItem('loginUser', response.data.username);
                    localStorage.setItem('role', response.data.role);

                    this.setState({
                        btnLoginDisabled: false,
                        btnLoginText: "登录"
                    });

                    if (this.props.location.state) {
                        this.context.router.history.push(this.props.location.state)
                    } else {
                        this.context.router.history.push('/customer')
                    }
                }
            }.bind(this))

            .then(null, () => this.setState({
                btnLoginDisabled: false,
                btnLoginText: "登录"
            }))
    }

    render() {
        return tplRender.bind(this)()
    }
}

class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {logout: false}
    }

    componentDidMount() {
        logout()
            .then((response) => {
                if (response.status == 200) {
                    localStorage.removeItem('role');
                    localStorage.removeItem('loginUser');
                    this.setState({logout: true})
                }
            })
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: "/" } };
        if (this.state.logout)
            return <Redirect to="/login" />;
        else
            return null;
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Login;
export {Logout};
