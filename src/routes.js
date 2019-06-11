import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'
Vue.use(Router);

//此处直接返回[]数组，而没有写成{routes:[]}
//不然报错，forEach不是一个方法
export default[
    {
      path: '/',
      component: HelloWorld
    },
    {
      path: '/Login',
      component: Login
    }
  ]
