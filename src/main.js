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

//请求拦截
Axios.interceptors.request.use(config => {
  //解决IE请求缓存(不知道什么用，先注释了)
  // if (config.method === 'get') {
  //   config.params.tForIE = new Date()
  // }
  //在axios中传入config，配置一个参数来控制。如果loading为false，则不需要loading
  if (config.method === 'get' || config.method === 'delete') {
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


Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

/* eslint-disable no-new */
vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

//封装全局指令
Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener("keypress", function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});

//封装输入框
Vue.component('currency-input', {
  template: '\
    <span v-bind:class="classObject">\
      <input\
        class="el-input__inner"\
        v-bind:style="styleObject"\
        ref="input"\
        v-bind:placeholder="placeholder"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  data: function () {
    return {
      defaultStyle: {
        width: '85px'
      }
    }
  },
  computed: {
    styleObject: function () {
      return this.customStyle || this.defaultStyle
    },
    classObject: function () {
      return this.customClass || 'el-input--mini'
    }
  },
  props: ['value', 'placeholder', 'customClass', 'customStyle', "decimalNum"],
  methods: {
    // 不是直接更新值，而是使用此方法来对输入值进行格式化和位数限制
    updateValue: function (value) {
      var formattedValue = value;
      var decimalNum = this.decimalNum ? this.decimalNum : 2;//保留位数控制
      formattedValue = value
        //先把非数字的都替换掉，除了数字和小数点
        .replace(/[^(\-?)\d\.]/g, '')
        .replace(/^0+/g, '0')
        //必须保证第一个为数字而不是小数点
        .replace(/^\./g, '')
        //保证只有出现一个小数点而没有多个. 
        .replace(/\.{2,}/g, '.')
        //保证小数点只出现一次，而不能出现两次以上 
        .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        //保留两位小数
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + (decimalNum + 1)
        )
      // // 如果值尚不合规，则手动覆盖为合规的值
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // 通过 input 事件带出数值
      this.$emit('input', formattedValue)
    }
  }
})

//浮点数运算重构，使用示例 a+b => a.add(b)   a-b => a.sub(b)  a*b => a.mul(b)  a/b => a.div(b)
/**浮点数的加运算*/
Number.prototype.add = function (arg) {
  return operation(this, arg, 'add');
};
/**浮点数的减运算*/
Number.prototype.sub = function (arg) {
  return operation(this, arg, 'subtract');
};
/**浮点数的乘运算*/
Number.prototype.mul = function (arg) {
  return operation(this, arg, 'multiply');
};
/**浮点数的除运算*/
Number.prototype.div = function (arg) {
  return operation(this, arg, 'divide');
};

function isInteger(obj) {
  return Math.floor(obj) === obj
}
/**将浮点数转为整数，并保存放大的倍数。如0.02 返回2，100 */
function toInteger(floatNum) {
  var ret = { floatLength: 1, intNum: 0 };
  if (isInteger(floatNum)) {//如果是整数
    ret.intNum = floatNum;
  }
  else {
    var strFloat = floatNum + '';
    var dotPosition = strFloat.indexOf('.');
    var len = strFloat.substr(dotPosition + 1).length;
    var floatLength = Math.pow(10, len);
    var intNum = parseInt(Math.abs(floatNum) * floatLength + 0.5, 10);//放大
    ret.floatLength = floatLength;
    if (floatNum < 0) {//负数的处理
      intNum = -intNum;
    }
    ret.intNum = intNum;
  }
  return ret;
}
function operation(a, b, opType) {
  var o1 = toInteger(a);
  var o2 = toInteger(b);
  var int1 = o1.intNum;
  var int2 = o2.intNum;
  var langth1 = o1.floatLength;
  var langth2 = o2.floatLength;
  var maxLength = langth1 > langth2 ? langth1 : langth2;//以最大位数为基准
  var result = null;
  switch (opType) {
    case 'add':
      if (langth1 === langth2) { //两个小数位数相同
        result = int1 + int2;
      } else if (langth1 > langth2) {
        result = int1 + int2 * (langth1 / langth2);
      } else {
        result = int1 * (langth2 / langth1) + int2;
      }
      return result / maxLength;
    case 'subtract':
      if (langth1 === langth2) {
        result = int1 - int2;
      } else if (langth1 > langth2) {
        result = int1 - int2 * (langth1 / langth2);
      } else {
        result = int1 * (langth2 / langth1) - int2;
      }
      return result / maxLength;
    case 'multiply':
      result = (int1 * int2) / (langth1 * langth2);
      return result;
    case 'divide':
      result = (int1 / int2) / (langth1 / langth2);
      return result;
  }
}