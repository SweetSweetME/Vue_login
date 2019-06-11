// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.config.productionTip = false
//将axios挂载到vue的原型链上（因为axios并不是vue的插件，如果不挂载，则需要每个组件中引入axios）
Vue.prototype.$http = axios

Vue.use(VueRouter);
const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router: router
})
