import { BaseHistory } from "./base";
class HTML5History extends BaseHistory {
  constructor(router) {
    super(router);
  }
  push(location) {
    this.transitionTo(location, (route) => {
      window.history.pushState({}, null, route.path);
    });
  }
  replace(location) {
    this.transitionTo(location, (route) => {
      window.history.replace({}, null, route.path);
    });
  }
  setupListeners() {
    window.addEventListener('popstate', () => {
      this.transitionTo(window.location.pathname);
    });
  }
  getCurrentLocation() {
    return window.location.pathname;
  }
}
export {
  HTML5History,
}