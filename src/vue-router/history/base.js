class BaseHistory {
  constructor(router) {
    this.router = router;
    // 创建初始默认路由匹配列表将它赋予this.current
    this.current = createRoute(null, {
      path: '/',
    });
  }

  /**
   * 内部首先通过this.router.matcher.match(location)
   * 寻找当前需要跳转的location匹配的路有记录
   * 
   * @param {*} location 
   * @param {*} onComplete 
   * @returns 
   */
  transitionTo(location, onComplete) {
    // 寻找到即将跳转路径匹配到的路由对象
    const route = this.router.matcher.match(location);
    console.log(route);
    if (
      this.current.path === route.path &&
      route.matched.length === this.current.matched.length
    ) {
      // 1. 判断前后path是否在一致
      // 2. 判断匹配路由对象个数
      // 说的是首次初始化时 this.current为{path:'/',matched:[]}
      // 若打开页面同样为'/'时,此时单纯判断path就无法渲染了
      // (说实话上面没看懂啥意思)
      // ???????
      return;
    }
    if (route) {
      this.updateRoute(route);
      onComplete && onComplete(route);
    }
  }
  updateRoute(route) {
    this.current = route;
    this.cb && this.cb(route);
    // console.log('更新后的current', this.current);
  }
  listen(cb) {
    this.cb = cb;
  }
}
/**
 * 接受传入的路由record对象以及location对象
 * (location只考虑path,name属性)返回一个路由匹配映射的数组
 * @export 
 * @param {*} record 路有记录对象(通过match匹配属性中维护列表获取)
 * @param {*} location 用户传入参数
 * @returns 寻找当前路径匹配的所有路由
 * '/about/about1'=>
 * [{path:'/about},{path:'/about/about1'} ]
 */
function createRoute(record, location) {
  const matched = [];
  if (record) {
    while (record) {
      // 从头部添加
      // console.log(record);
      matched.unshift(record);
      // 依次递归寻找父路由记录
      record = record.parent;
    }
  }
  // console.log(matched,'matched');
  return {
    matched,
    ...location,
  }
}

export { BaseHistory, createRoute };