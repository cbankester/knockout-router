import assert from 'assert';
import RouteRecognizer from 'route-recognizer';

export default class Router {
  getControllerForRoute({controller, handler}) {
    let ret = controller;
    if (!ret) ret = typeof handler === 'string' ? this[handler] || this.app[handler] : this;
    return ret;
  }
  configureComponent(component_vm) {
    const {name, template} = component_vm;
    console.log({name, template});
    assert(name, `Cannot register component without a name; please define static method ${component_vm.constructor.name}.name`);
    assert(template, `Cannot register component without template; please define static method ${component_vm.constructor.name}.template`);
    ko.components.register(name, {
      viewModel: component_vm,
      template
    });
  }
  generateHandler(route) {
    const {path, handler, page} = route;
    assert(typeof handler === 'string' || typeof handler === 'function', '`handler` should be either string or function');
    const controller = this.getControllerForRoute(route);
    assert(controller, `Cannot find method ${handler} on the router or on the the main view model`);
    let {meta} = route;
    if (!meta) meta = {};
    return params => {
      const attenuated_params = Object.assign(meta, params);
      return Promise.resolve()
      .then(() => this.preHandle(path, handler, attenuated_params))
      .then(() => (typeof handler === 'string' ? controller[handler].bind(controller) : handler.bind(controller))(attenuated_params))
      .then(component_params => {
        if (page) {
          this.current_page(page.name);
          this.current_params(component_params);
        } else {
          this.current_page(void 0);
          this.current_params(void 0);
        }
      })
      .then(() => this.postHandle(path, handler, attenuated_params));
    };
  }
  constructor(app, routes) {
    this.app = app;
    this.routes = routes;
    this.route_recognizer = new RouteRecognizer();
    this.current_page = ko.observable();
    this.current_params = ko.observable();
    for (const route of routes) {
      if (route.page) this.configureComponent(route.page);
      this.route_recognizer.add([{
        path: route.path,
        handler: this.generateHandler(route)
      }]);
    }
  }
  preHandle(path, handler, params={}) {
    return new Promise(resolve => {
      console.log('prehandler', {path, params});
      resolve();
    });
  }
  postHandle(path, handler, params={}) {
    return new Promise(resolve => {
      console.log('posthandler', {path, params});
      resolve();
    });
  }
  unrecognizedRouteHandler(path) {
    const err = new Error("404 Not Found");
    err.path = path;
    err.status = 404;
    return Promise.reject(err);
  }

  handlePath(path, opts={}) {
    const recognized_route = this.route_recognizer.recognize(path);
    if (!recognized_route) return this.unrecognizedRouteHandler(path);
    const {handler, params} = recognized_route[0];
    const attenuated_params = Object.assign(params, opts);
    return handler(attenuated_params)
    .then(() => Promise.resolve(attenuated_params))
    .catch(err => {
      const e = new Error(`Could not handle path '${path}': ${err.message || err}`);
      e.original_error = err;
      e.params = attenuated_params;
      return Promise.reject(e);
    });
  }
}
