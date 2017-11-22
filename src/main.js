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
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
