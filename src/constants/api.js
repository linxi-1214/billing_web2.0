/**
 * Created by wangxb on 18/6/14.
 */
const CALL_API = Symbol('Call API');
const CALL_API_START = "CALL_API_START";
const CALL_API_FAIL = "CALL_API_FAIL";

let USER_SERVICE_BASEPATH = 'https://user.paratera.com/user/api';
let BILL_BASEPATH = 'https://billing.paratera.com/api';

/*
let USER_SERVICE_BASEPATH = 'https://user.paratera.com/user/api'
let BASEPATH_BILL = 'http://billing.paratera.com/api'
*/

if (process.env.NODE_ENV !== 'production') {
    BILL_BASEPATH ='http://localhost:3000/billing/api'
}
export {
    CALL_API,
    CALL_API_START,
    CALL_API_FAIL,
    USER_SERVICE_BASEPATH,
    BILL_BASEPATH
}
