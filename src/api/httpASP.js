import Axios from 'axios'
import Cookies from "js-cookie";

//baseUrl到index.html配置
Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = baseUrl;

const DECODE = {
    CODE_INVALID: -1,//失效
    CODE_OK: 0,//成功
    CODE_FAIL: 1//失败
}
//退出登录
function logout() {
    vm.$router.push({
        name: "login",
        params: {
            autoSign: false
        }
    });
}
function funcThen(response, resolve, reject) {
    var res = response.data;
    if (res.code == DECODE.CODE_INVALID) {//失效
        logout();
        console.log(res.msg?res.msg:res);
        reject(res);
    } else if (res.code == DECODE.CODE_OK) {//成功
        resolve(res);
    } else {//其他返回失败
        console.log(res.msg?res.msg:res);
        reject(res);
    }
}
function funcCatch(err, reject) {
    console.log(err.msg?err.msg:err);
    reject(err)
}
/**
 * 封装get方法
 * @param url 
 * @param params 
 * @returns {Promise} 
 */
export function z_get(url, params = {}, config = {}) {
    return new Promise((resolve, reject) => {
        Axios.get(url, {
            params: params,
            data: params,
            config: config
        })
            .then(response => funcThen(response, resolve, reject))
            .catch(err => funcCatch(err, reject))
    })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function z_post(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        Axios.post(url, data, config)
            .then(response => funcThen(response, resolve, reject))
            .catch(err => funcCatch(err, reject))
    })
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function z_patch(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        Axios.patch(url, data, config)
            .then(response => funcThen(response, resolve, reject))
            .catch(err => funcCatch(err, reject))
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function z_put(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        Axios.put(url, data, config)
            .then(response => funcThen(response, resolve, reject))
            .catch(err => funcCatch(err, reject))
    })
}
/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function z_delete(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        Axios.delete(url, {
            params: data,
            data: data,
            config: config
        })
            .then(response => funcThen(response, resolve, reject))
            .catch(err => funcCatch(err, reject))
    })
}