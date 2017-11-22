import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/index'
import iView from 'iview'

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/(index.html)?',
      name: 'HelloWorld',
      component: Home
    },
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
