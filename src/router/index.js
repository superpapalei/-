import Vue from 'vue'
import store from '.././store'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import MainOld from '@/components/mainOld'
import Test from '@/components/test'
import ScheduleTest from '@/components/ScheduleTest'
import ScheduleControl from '@/components/control/ScheduleControl'

import emp from '@/components/hr/emp'
import dept from '@/components/hr/dept'

import standardTask from '@/components/project-preparation/standard-task'

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
      children: [
        {
          path: '/test',
          name: 'test',
          component: Test,
        },
        {
          path: '/emp',
          name: 'emp',
          component: emp,
        },
        {
          path: '/dept',
          name: 'dept',
          component: dept,
        },
        {
          path: '/ScheduleTest',
          name: 'ScheduleTest',
          component: ScheduleTest,
        },
        {
          path: '/standardTask',
          name: 'standardTask',
          component: standardTask,
        }
      ]
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
      store.commit('navTabs/emptyBreadCrumb');//到主页面后清空导航
      if (to.name == 'login' || to.name == 'main') {
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
