import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/vueadvancedchat'
    },
    {
      path: '/vueadvancedchat',
      component: () => import("@/views/vueadvancedchat/index")
    }
  ]
})