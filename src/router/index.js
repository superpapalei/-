import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import Test from '@/components/test'
import Calendar from '@/components/canlen_com/calendar'
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
          path: '/canlen_com/calendar',
          name: 'calendar',
          component: Calendar,
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
