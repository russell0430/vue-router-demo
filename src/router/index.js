import Vue from 'vue'
import VueRouter from '../vue-router';
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import About1 from "../views/about-children/about1.vue"
import About2 from "../views/about-children/about2.vue";
import Home1 from "../views/home-children/home1.vue";
import Home2 from "../views/home-children/home2.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path:'home1',
        name:'Home1',
        component:Home1,
      },
      {
        path:'home2',
        name:'Home2',
        component:Home2,
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children:[
      {
        path:'about1',
        name:'About1',
        component:About1,
      },
      {
        path:'about2',
        name:'About2',
        component:About2,
      }
    ]
  }
]
// 可以看到初始化 new VueRouter时三个参数:
// - mode :表示路由模式,支持[history,hash,abstract]
// - base :应用的基路径
// - routes :传入的路径配置选项,开始前已经配置一分路由表

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
