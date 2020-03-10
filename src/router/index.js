import Vue from 'vue'
import store from '.././store'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: []
    }
  ]
})
//解决刷新后点击tab报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//路由守卫
router.beforeEach((to, from, next) => {
  // if (!Cookies.get('cid') && !Cookies.get('customerType') && to.name != 'login') {//判断用户信息，不合法返回登陆界面
  //   next('/login')
  // } else {
  if (from.path == '/') {
    if ((to.name == 'login' && to.redirectedFrom && to.redirectedFrom == '/') || to.name == 'main') {
      next()
    }
    else {
      next('/main');
    }
  }
  else {//不是刷新
    next();
    history.pushState(null, null, location.href);//禁止后退，搭配APP.VUE里面的mounted
  }
  // }
})

export default router;
