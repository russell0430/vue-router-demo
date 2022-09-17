import install from './install';
import { createMatcher } from './create-matcher';
import { HTML5History } from "./history/html5";
import { HashHistory } from "./history/hash";
class VueRouter {
  constructor(options) {
    this.options = options;
    this.matcher = createMatcher(options.routes || []);
    // console.log(this.matcher.getRoutes());
    const mode = options.mode || 'hash';
    switch (mode) {
      case 'hash':
        this.history = new HashHistory(this);
        break;
      case 'history':
        this.history = new HTML5History(this);
        break;
    }
  }
  // app 是Vue根节点实例
  init(app) {
    this.app = app;
    const history = this.history;

    // 路由变化监听函数
    const setupListeners = (route) => {
      // history.setupListeners()是监听页面路径变化的事件监听函数
      // 针对不同的路由模式存在不同的监听事件Api
      history.setupListeners();
    }

    // 初始化时,根据当前页面渲染一次页面
    history.transitionTo(history.getCurrentLocation(), setupListeners);

    //额外定义history.listen方法,传入callback
    history.listen((route) => {
      app._route = route;
    })
  }

  // 注册多个路由
  addRoutes(routes) {
    this.matcher.addRoutes(routes);
  }

  // 注册路由
  addRoute(parenOrRoute, route) {
    this.matcher.addRoute(parenOrRoute, route);
  }
  getRoutes() {
    return this.matcher.getRoutes();
  }
  // 跳转
  push(location) {
    this.history.push(location);
  }
  // 替换
  replace(location) {
    this.history.replace(location);
  }

}

// 调用Vue.use(VueRouter时,会调用install注册)
// VueRouter.install(Vue)

// 注册完成后:
// - 任意组件实例拥有$router获取VueRouter实例对象
// - 任意组件实例有$route属性(还没实现,我猜是挂到$router,再次代理)
// - 定义了两个全局组件,routerLink,routerView
VueRouter.install = install;
export default VueRouter;

// 当前前端路由分为两个类型
// - hash模式
//   传统前端路路由代表就是hash模式,在URL通过onhashchange事件根据匹配到的record对象动态渲染页面
//   但是路由路径有'#'
// - history模式
//   基于HTML History Api进行H%路由,基于window.onpopstate事件
//   执行相应的逻辑渲染页面
//   H5 history模式路由需要服务端支持,因为路由发生改变会发送完整路径请求服务器,hash模式不会
//
// history.setupListeners监听页面路径变化,针对不同的路由模式存在不同的监听事件Api
// 定义公用的Base class以及两个子类 HashHistory,HTML5History,
// 针对不同的模式需要有不同的监听函数,所以方法应该在各自子类上实现
// history.transitionTo方法,是VueRouter路由跳转的核心方法
// 