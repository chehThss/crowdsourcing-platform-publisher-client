import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import AboutSite from '@/pages/aboutSite'
import Register from '@/pages/register'
import PersonalCenter from '@/pages/personalCenter'
import ProfileSettings from '@/pages/profileSettings'
import PasswordSet from '@/pages/passwordSet'
import ForgetPassword from '@/pages/forgetPassword'
import ResetPassword from '@/pages/resetPassword'
import UserAdmin from '@/pages/userAdminPages/index'
import UsersManage from '@/pages/userAdminPages/usersManage'
import PublisherIndex from '@/pages/publisherPages/index'
import MyTasksManage from '@/pages/publisherPages/myTasksManage'
import TaskCreate from '@/pages/publisherPages/taskCreate'
import TaskAdminIndex from '@/pages/taskAdminPages/index'
import TasksManage from '@/pages/taskAdminPages/tasksManage'
import iView from 'iview'
import store from '../store'

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
      path: '/admin/about',
      name: 'aboutSite',
      component: AboutSite
    },
    {
      path: '/admin/register',
      name: 'register',
      component: Register
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
    },
    {
      path: '/admin/users',
      component: UserAdmin,
      children: [
        {
          path: 'manage',
          name: 'usersManage',
          component: UsersManage,
          props: true,
        }
      ]
    },
    {
      path: '/admin/my-tasks',
      component: PublisherIndex,
      children: [
        {
          path: 'manage',
          name: 'myTasksManage',
          component: MyTasksManage
        },
        {
          path: 'create',
          name: 'taskCreate',
          component: TaskCreate
        }
      ]
    },
    {
      path: '/admin/tasks',
      component: TaskAdminIndex,
      children: [
        {
          path: 'manage',
          name: 'tasksManage',
          component: TasksManage
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  store.commit('appshell/menuNameSet', to.name);
  next();
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
