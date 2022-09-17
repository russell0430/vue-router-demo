import { BaseHistory } from "./base";

class HashHistory extends BaseHistory {
  constructor(router) {
    super(router);
    // 初始化hash路由,确保路由存在#并且#后一定拼接/
    ensureSlash();
  }
  push(location) {
    this.transitionTo(location, (route) => {
      // location
      window.location.hash = route.path;
    });
  }
  replace(location) {
    this.transitionTo(location, (route) => {
      window.location.replace(route.path);
    });
  }
  // 设置监听函数
  setupListeners() {
    // 源码中hash路由做判断,优先使用popstate,不支持时使用hashchange
    // const eventTypesupportsPushState?'popstate':'hashchange';
    // 这里使用hashchange
    window.addEventListener('hashchange', () => {
      this.transitionTo(getHash());
    })
  }
  getCurrentLocation() {
    return getHash();
  }
}

function ensureSlash() {
  const path = getHash();
  // 若 # 后是以'/'开拓 return true
  if (path.charAt(0) === '/') {
    return true;
  }
  replaceHash('/' + path);
  return false;
}
/**
 * 首先获取 # 前的基础路径 
 * https://mysite.com/#/a/b
 * base为 https://mysite.com/
 * 之后使用传入的path进行拼接
 * @param {*} path 
 * @returns
 */
function getUrl(path) {
  const href = window.location.href;
  const i = href.indexOf('#');
  const base = i >= 0 ? href.slice(0, i) : href;
  return `${base}${path}`;
}
// 替换当前页面路径
function replaceHash(path) {
  window.location.replace(getUrl(path));
}
/**
 * 获取当前页面#后的路径
 * 若不存在 # 直接返回 ''
 * @export 
 * @returns 
 */
function getHash() {
  let href = window.location.href;
  const index = href.indexOf('#');
  if (index < 0) return '';
  href = href.slice(index + 1);
  return href;
}
/**
 * - 首先在new HashHistory实例对象时,在hash模式下会多出ensureSlash
 *   为了baozhengyemianUrl上一定存在#/路径
 * - HashHistory 定义replace,push两个实例,
 *   分别调用BaseHistory的transitionTo进行页面重新渲染,
 *   完成重新跳转后执行第二个参数的回调函数更新页面URL路径
 * - setupListeners内部有监听函数,页面路径变化会调用this.transitionTo更新页面
 * - getCurrentLocation获取当前页面hash '#' 之后的路径,
 * 
 */
export { HashHistory, getHash };