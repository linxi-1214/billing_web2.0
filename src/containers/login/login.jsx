import React from 'react';
import classNames from 'classnames';

export default function render() {
    const {
        email,
        pwd,
        emailValid,
        pwdValid,
        btnLoginDisabled,
        btnLoginText
    } = this.state;

    let emailCls = classNames({
        'form-group': true,
        'has-error': !emailValid
    });

    let pwdCls = classNames({
        'form-group': true,
        'has-error': !pwdValid
    });

    return (
        <div className="container">
            <div class="row">
                <div class="col align-self-center">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className={emailCls}>
                            <label htmlFor="loginInputEmail">用户名</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <span className="fa fa-user"></span>
                                    </span>
                                </div>
                                <input type="text" className="form-control" placeholder="邮箱"
                                       ref="emailInput"
                                       value={email}
                                       onChange={this.emailChange.bind(this)}
                                       autoFocus/>
                            </div>
                        </div>
                        <div className={pwdCls}>
                            <label>密码</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <span className="fa fa-lock"></span>
                                    </span>
                                </div>
                                <input type="password" className="form-control" placeholder="密码"
                                       ref="pwdInput"
                                       value={pwd}
                                       onChange={this.pwdChange.bind(this)}/>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block"
                                disabled={btnLoginDisabled}>{btnLoginText}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

