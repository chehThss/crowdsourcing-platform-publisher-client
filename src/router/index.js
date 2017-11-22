import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/index'
import Register from '@/pages/register'
import iView from 'iview'

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/(index.html)?',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
