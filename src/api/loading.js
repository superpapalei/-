import Vue from 'vue'
var debounce = require('lodash.debounce');

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading;
function startLoading() {   
    loading = Vue.prototype.$loading({
        lock: true,
        text: "加载中...",
        target: document.querySelector('.loading-area')//设置加载动画区域
    });
}
function endLoading() {
    loading.close();
}

//声明一个对象用于存储请求个数
let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
};
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
};
// export let tryHideFullScreenLoading = debounce(function() {
//     // if (needLoadingRequestCount <= 0) return;
//     // needLoadingRequestCount--;
//     // if (needLoadingRequestCount === 0) {
//     //     endLoading();
//     // }
//     endLoading();
// }, 100)



