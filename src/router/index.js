import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Register from '@/pages/register'
import TaskSubmit from '@/pages/task_submit'
import PersonalCenter from '@/pages/personalCenter'
import ProfileSettings from '@/pages/profileSettings'
import PasswordSet from '@/pages/passwordSet'
import ForgetPassword from '@/pages/forgetPassword'
import ResetPassword from '@/pages/resetPassword'
import iView from 'iview'

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/admin/(index.html)?',
      name: 'home',
      component: Home
    },
    {
      path: '/admin/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin/submit',
      name: 'submit',
      component: TaskSubmit
    },
    {
      path: '/admin/account',
      component: PersonalCenter,
      children: [
        {
          path: '',
          redirect: {name: 'profileSettings'},
        },
        {
          path: 'profile',
          name: 'profileSettings',
          component: ProfileSettings,
        },
        {
          path: 'password',
          name: 'passwordSet',
          component: PasswordSet,
        },
      ]
    },
    {
      path: '/admin/forget-password',
      name: 'forgetPassword',
      component: ForgetPassword,
    },
    {
      path: '/admin/reset-password',
      name: 'resetPassword',
      component: ResetPassword,
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
