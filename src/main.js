// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import iView from 'iview';
import router from './router';
import components from './components';
import store from './store';
import { sync } from 'vuex-router-sync';
import './my-theme/index.less';

Vue.config.productionTip = false;
sync(store, router);
Vue.use(iView);
Object.keys(components).forEach(x => Vue.component(x, components[x]));

/* eslint-disable no-new */
let app = new Vue({
  store,
  router,
  data: {
    title: '云众包',
  },
  template: '<App/>',
  mounted() {
    switch (this.$route.query.action) {
      case 'create-user': {
        const token = this.$route.query.token;
        store.dispatch('user/confirmMail', {
          id: token,
          action: 'create-user'
        }).then(() =>
          this.$Message.success('用户创建成功，请重新登录！')
        ).catch(err => {
          switch (err.message) {
            case 'Invalid token':
              this.$Message.error('用户创建失败，无效的凭证！');
              break;
            case 'Username has been taken':
              this.$Message.error('用户创建失败，用户名已被注册！');
              break;
            case 'Email has been taken':
              this.$Message.error('用户创建失败，邮箱已被注册！');
              break;
            default:
              console.error(err);
              this.$Message.error(err.message);
          }
        }).then(() => {
          const query = Object.assign({}, this.$route.query);
          delete query.token;
          delete query.action;
          router.replace({
            path: this.$route.path,
            query
          });
        });
        break;
      }
      case 'reset-password':
        // Do nothing
        break;
      default: {
        const jwt = localStorage.getItem('jwt');
        if (jwt)
          store.dispatch('auth/authAndGetUser', {strategy: 'jwt', payload: {jwt}}).catch(err => {
            console.error(err);
          });
      }
    }
  },
  mixins: [App]
});

store.commit('global/setSite', store.state.global.site);
router.onReady(() => app.$mount('#app'));
