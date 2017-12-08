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
  router,
  store,
  data: {
    title: '云众包',
  },
  template: '<App/>',
  mounted() {
    const jwt = localStorage.getItem('jwt');
    if (jwt)
      store.dispatch('auth/authAndGetUser', {strategy: 'jwt', payload: {jwt}}).catch(err => {
        console.error(err);
      });
  },
  mixins: [App]
});

store.commit('global/setSite', store.state.global.site);
router.onReady(() => app.$mount('#app'));
