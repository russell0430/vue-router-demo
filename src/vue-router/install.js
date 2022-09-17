import Link from "./components/router-link.vue";
import View from "./components/router-view.vue";
let _Vue;
export default function install(Vue){
  // 查看是否安装
  if(install.installed&&_Vue===Vue)return;
  // 首次调用Vue.use 将install.installed置为true
  install.installed=true;

  //保存Vue 提供给别人用
  _Vue=Vue;
  Vue.mixin({
    beforeCreate(){
      if(this.$options.router){
        // 若有当前options存在router对象,表示该实例是跟对象
        this._rootRouter=this;
        this._rootRouter._router=this.$options.router;
        this._router.init(this);
        // 根组件挂载_router时,在根组件上定义一个_route响应式属性
        // 初始值为this._router.history.current
        // 所有组件都可以通过this._rootRouter访问到根组件实例,
        // name同样可以通过 this._rootRouter._route访问到当前路由对象current
        // current也是日常使用的$route对象
        Vue.util.defineReactive(this,'_route',this._router.history.current);
        
      }else {
        // 非根
        this._rootRouter=this.$parent&&this.$parent._rootRouter;
      }
    },
  });

  Object.defineProperty(Vue.prototype,'$router',{
    get(){
      return this._rootRouter._router;
    }
  });
  Object.defineProperty(Vue.prototype,'$route',{
    get(){
      return this._rootRouter._route;
    }
  });
  /**
   * 通过Veu.util.defineReactive将$ourte定义为响应式对象,
   * 但是当前路径改变或者通过Api调用push方法时,
   * 改变的是BaseHistory的current属性值,根组件实例上this._route值不会改变
   * 所以需要在BaseHistory属性改变后同步改变根组件实例上的_route响应式属性
   */

  Vue.component('router-link',Link);
  Vue.component('router-view',View);
}
// Vue.use Api
// 若Vue需要注册全局Vue Plugin 需要通过调用Vue.use(Plugin)
// Vue.use(Plugin)的Plugin,注册的Plugin需要满足:
// - 当注册的Plugin是一个对象,则对象上存在install方法
// - 注册的Plugin是一个函数,那么函数存在一个静态install方法
// 当调用Vue.use时,会调用对应注册插件的install方法,同时传入Vue构造函数作为参数


// 1. _Vue变量
// 首先在install方法中提到过Vue.use()时会传入当前Vue的构造函数对象,
// 此时可以利用外部的_Vue存储传入的Vue
// 
// 2. Vue.mixins()
// 在install方法中利用Vue.mixins为每个通过该Vue创建的实例对象注入一个beforeCreate逻辑
// 就是自己是根节点就获得_router,自己不是,就从父节点那里获取
// 在项目入口文件中(通常是main.js),会这样使用router实例对象
// new Vue({
//   router, 
// }).$mount('#app);
// 在项目中使用vue-router,通常会将初始化的router对象加入new Vue的参数中,
// 此时根组件实例尚可以通过this.$options.router获取创建的router
// install为每一个组件实例注入了beforeCreate钩子,在每一个组件实例判断
// - 若组件是根组件实例(根据this.$options上存在router对象判断)
//   实例对象上定义_rootRouter对象,为自身实例对象
//   同时定义一个_router,值为外部传入的router实例,即this.$options.router
// - 若该组件非根组件实例,同样没一个组件定义一个名为_rootRouter,它最终会指向根组件实例
//   并且对于Vue.$router被get()代理,返回this._rootRouter._router
//   就可以在每一个组件this.$router返回根组件上的router实例
//   使用_rootRouter相当于是一个指针,指向根节点

// 3. 组件注册&定义属性
// 使用Vue-Router时,会帮助注册两个组件:
// - <router-view></router-view>
// - <router-link></router-link>
// 之后会讲两个组件,对应的文件是 components/link.js,components/view.js

// install的基础逻辑完成,将install方法到处给index.js中的VueRouter类使用



