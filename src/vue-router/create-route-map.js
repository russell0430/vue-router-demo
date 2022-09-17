// 用到createRouteMap的时候
// 1. 首次进行 new VueRouter(options)时调用createMatcher调用
// createRouteMap(routes)传入出事了路由配置列表,
// 此时createRouteMap支持传入初始化的路由列表进行扁平化
// 2. 在调用addRoutes方法是会通过createRouteMap传入
// 旧的pathList,pathMap,nameMap,parent对象,同时方法支持原有路由添加路由对象


/**
 * @return pathList:包含当前所有路径的数组
 * @return pathMap:包含当前所有路径的因社会表对象
 * @return nameMap:
 */
// 参数
// - 一个必选参数,routes表示本次需要添加(格式化)的路由列表,是一个数组
// - 可选参数 oldPathList,数组
// - 可选参数 oldPathMap 旧的路由映射表
// - 可选参数 oldNameMap 旧的路由名称映射表
// - 可选参数 parent 表示需要添加的路由的父路由
// 如果指定了parentRoute参数会将格式化的routes对象添加到指定的parent路由对象,而非根对象


function createRouteMap(
  routes, oldPathList, oldPathMap, oldNameMap, parentRoute
) {
  // 获取之前的路径对应表
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || Object.create(null);
  const nameMap = oldNameMap || Object.create(null);
  // 递归格式化路径记录
  routes.forEach((route) => {
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute);
  });
  return {
    pathList,
    pathMap,
    nameMap,
  };
}

// pathList :['/home1', '/home2', '/', '/about/about1', '/about/about2', '/about']
// pathMap :{
//   "/home1": {
//      "name": "Home1",  // 路径对应的路由名称
//      "component": {}, // 路径对应的渲染组件
//      "path": "/home1", // 路由路径
//      "props": {}, // 路径对应的组件props
//      "meta": {}, // 路径对应的组件meta
//      "parent": { ... } // 该路径的父路由记录对象
//   },
//   ...
// }
// pathMap维护一份路由路径为key,路径记录对象为Value的映射表

// nameMap:{
//    "Home1": {
//     "name": "Home1",
//     "component": {},
//     "path": "/home1",
//     "props": {},
//     "meta": {},
//     "parent": { ... }
//  },
//  ...
// }
//  nameMap和pathMap同理,维护一个名称映射表

// pathList,pathMap,nameMap是全局变量
// route是嵌套路由中的项,parent是上一句路由的Record
function addRouteRecord(pathList, pathMap, nameMap, route, parent) {
  const { path, name } = route;
  // 实现路由嵌套的路径拼接
  const normalizedPath = normalizePath(path, parent);
  // 根据传入的route对象创建一个路有记录对象Record
  // 
  const record = {
    name: route.name,
    component: route.component,
    path: normalizedPath,
    props: route.props || {},
    meta: route.meta || {},
    parent
  }
  // 递归添加children属性
  if (route.children) {
    route.children.forEach((child) => {
      addRouteRecord(pathList, pathMap, nameMap, child, record);
    })
  }
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }
  if (name && !nameMap[name]) {
    nameMap[name] = record;
  }
}

/**
 * 
 * @param {string} path 
 * @param {string} parent 
 */
function normalizePath(path, parent) {
  if (!parent) {
    return path;
  }
  // '/' 认为是根路径
  if (path.startsWith('/')) {
    return path;
  }
  if (parent.path.endsWith('/')) {
    return `${parent.path}${path}`;
  } else {
    return `${parent.path}/${path}`;
  }
}
export default createRouteMap;