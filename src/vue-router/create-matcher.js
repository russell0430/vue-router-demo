import  createRouteMap  from './create-route-map';
import { createRoute } from './history/base';
// 函数目的:
// 传入的routes是一个拥有children的嵌套结构的路由
// 需要createMatcher将传入的多尔维路由数据表格式化城一维列表
// 就一个路径对应一个组件的形式
// 嵌套结构是为了开发者开发时有更直观的结构
// 将嵌套转换成一维方便后续处理
// 同时暴露出Api方便后续使用
// - addRoute() 添加路由规则
// - addRoutes() 动态添加更多路由规则,参数符合routes选项要求
// - getRoutes() 获取活跃的路有记录
// - match() 根据传入的路径,获取当前路由匹配的所有记录对象
// createMatcher方法会讲外部传入的路由数据表扁平化
// 内部也会维护扁平化的路由列表
// 需找路由匹配记录或者动态注册路由,都是对映射表数据结构的增删改查操作
/**
 * 
 * @param {*} routes 
 */

//这个设计使用闭包管理内部数据,又有点像hook
function createMatcher(routes) {
  const { pathList, pathMap, nameMap } = createRouteMap(routes);
  // 动态注册单个路由
  // 动态注册时,支持覆盖同名路由
  // 注册单个路由支持指定在特定路由添加子路由,支持parent参数
  // 在内部进行了重载
  // 用法:
  // - 若仅传递了一个参数,直接在根路径下动态添加传入的路由记录(认为父路由为根路由)
  // - 如果传入两个参数,第一个参数为父路由名称,添加的路由添加到指定父路由
  function addRoute(parentOrRoute, route) {
    // 若第一个参数是非Object对象,那么它不是路由对象,代表传递的是对应parent路由的名称
    const parent =
      typeof parentOrRoute !== 'object' ? nameMap[parentOrRoute] : undefined;

    return createRouteMap([route || parentOrRoute], pathList,
      pathMap, nameMap, parent)
  }

  // 注册多个路由
  // 内部基于createRouteMap实现
  function addRoutes(routes) {
    return createRouteMap(routes, pathList, pathMap, nameMap);
  }

  // 获取当前所有活跃的路有记录
  // createMatcher方法内部维护pathList,我们遍历当前所有活跃路由路径
  // 获得每一个路由的Record对象返回即可
  function getRoutes() {
    return pathList.map(path => pathMap[path]);
  }
  // 通过传入一个location的路径参数,
  // 返回当前路径匹配到的所有路由record记录对象
  function match(location) {
    const next = typeof location === 'string' ? { path: location } : location;
    const { name, path } = next;
    // name属性存在,优先去nameMap查找当前name对应的record路有记录
    if (name) {
      const record = nameMap[name];
      // 没有相关匹配路由记录
      if (!record) return createRoute(null, location);
      return createRoute(record, next);
    } else if (path) {
      // 不存在name寻找path对应的record对象
      const record = pathMap[path];
      if (!record) return createRoute(null, location);
      return createRoute(record, next);
    }
  }
  return {
    addRoute,
    addRoutes,
    getRoutes,
    match,
  };
}

// createMtacher 方法内部抽离数据格式化逻辑,内部调用createRouteMap(routes)

export {
  createMatcher,
}