/**
 * Created by wangxb on 18/6/14.
 */
import { BILL_BASEPATH } from '../constants/api'
import md5 from 'md5';
import axios from 'axios';


export const login = (email, pwd) => {
    let password = md5(pwd);
    return axios(
        {
            url: BILL_BASEPATH + '/user/login/',
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: email,
                password: password
            }
        }
    )
};

export const logout = () => {
    return axios(
        {
            url: BILL_BASEPATH + '/user/logout/',
            method: 'get'
        }
    )
};

export const pre_login = () => {
    return axios(
        {
            url: BILL_BASEPATH + '/user/login/',
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
};