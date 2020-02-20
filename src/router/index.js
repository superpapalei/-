import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import MainOld from '@/components/mainOld'
import Test from '@/components/test'
import ScheduleTest from '@/components/ScheduleTest'
import ScheduleControl from '@/components/control/ScheduleControl'
import emp from '@/components/hr/emp'
import dept from '@/components/hr/dept'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/main'
    },
    {
      path: '',
      redirect: '/main'
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
          meta: {
            returnMain: true//该页面刷新回到主界面
          }
        },
        {
          path: '/emp',
          name: 'emp',
          component: emp,
          meta: {
            returnMain: true
          }
        },
        {
          path: '/dept',
          name: 'dept',
          component: dept,
          meta: {
            returnMain: true
          }
        },
        {
          path: '/ScheduleTest',
          name: 'ScheduleTest',
          component: ScheduleTest,
          meta: {
            returnMain: true//该页面刷新回到主界面
          }
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
  //其他具体需求开发时再加。如只允许一个账号登录等。
  if (from.path == '/' && to.meta.returnMain) {//如果是刷新判断是否需要回到主界面
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
})

export default router;
