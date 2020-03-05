// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import Axios from 'axios'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import './assets/css/base.css'
import store from './store'
import { showFullScreenLoading, tryHideFullScreenLoading } from './api/loading'
import * as custom from './common/js/filter'
import { z_get, z_post, z_patch, z_put, z_delete } from './api/httpASP'
import './common/js/floatCalculate'
import './common/js/directive'
import './common/js/component'
import  * as commonMethods from "./common/js/commonMethods";

Vue.use(ElementUI);
Vue.use(Cookies);

//引入全局变量
Vue.prototype.Global = {
  baseUrl: baseUrl,
}
//引入全局方法
Vue.prototype.z_get = z_get;
Vue.prototype.z_post = z_post;
Vue.prototype.z_patch = z_patch;
Vue.prototype.z_put = z_put;
Vue.prototype.z_delete = z_delete;
//注册全局方法
Object.keys(commonMethods).forEach(key => {
  Vue.prototype[key] = commonMethods[key];
})
//注册全局filter的同时注册为全局方法
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key]);
  Vue.prototype[key] = custom[key];
})

//请求拦截
Axios.interceptors.request.use(config => {
  config.headers.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3RyaW5nIiwiZXhwIjoxNzYzMzgxOTIyLCJpc3MiOiJ6aGlqaWFuZ2tlamkuY24iLCJhdWQiOiJ6aGlqaWFuZ2tlamkifQ.O1jF3WYUIrQoqa4FA9jGfsxJeTlzYKa-O78kpnonkhs"
  //在axios中传入config，配置一个参数来控制。如果loading为false，则不需要loading
  if (config.method === 'get') {
    if (config.config != undefined && config.config.loading != undefined && config.config.loading == false)
      return config;
  } else {
    if (config.loading != undefined && config.loading == false)
      return config;
  }
  showFullScreenLoading();
  return config;
}, err => {
  tryHideFullScreenLoading();
  Message.error({ message: '请求超时!' });
  return Promise.resolve(err);
})

//响应拦截
Axios.interceptors.response.use(res => {
  tryHideFullScreenLoading()
  return Promise.resolve(res);
}, err => {
  tryHideFullScreenLoading();
  return Promise.reject(err);
})
Vue.config.productionTip = false

/* eslint-disable no-new */
vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});