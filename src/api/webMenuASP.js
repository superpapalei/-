import { get, post, patch, put } from './httpASP'

//查找用户菜单权限
export function QueryWebMenuByUserId(data, config = {}) {
    return post('/WEB_MENU/QueryWebMenuByUserId', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}