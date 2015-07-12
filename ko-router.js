import RouteRecognizer from 'route-recognizer';

export default class Router {
  _configureComponent(component_vm) {
    let {name, template} = component_vm;
    console.log({name, template});
    if (!name) throw new Error(`Cannot register component without a name; please define static method ${component_vm.constructor.name}.name`);
    if (!template) throw new Error(`Cannot register component without template; please define static method ${component_vm.constructor.name}.template`);
    ko.components.register(name, {
      viewModel: component_vm,
      template: template
    });
  }
  _generateHandler(route) {
    let {path, handler, meta, controller, page} = route;
    if ('string' !== typeof handler && 'function' !== typeof handler) {
      throw new Error('`handler` should be either string or function');
    }
    if (!controller) controller = this;
    if (!meta) meta = {};
    return params => {
      let attenuated_params = Object.assign(meta, params);
      return Promise.resolve()
      .then(() => this.preHandle(path, handler, attenuated_params))
      .then(() => ('string' === typeof handler ? controller[handler].bind(controller) : handler.bind(controller))(attenuated_params))
      .then(component_params => {
        if (page) {
          this.current_page(page.name);
          this.current_params(attenuated_params);
        } else {
          this.current_page(void 0);
          this.current_params(void 0);
        }
      })
      .then(() => this.postHandle(path, handler, attenuated_params));
    }
  }
  constructor(app, routes) {
    this.app              = app;
    this.routes           = routes;
    this.route_recognizer = new RouteRecognizer();
    this.current_page     = ko.observable();
    this.current_params   = ko.observable();
    for (let route of routes) {
      if (route.page) {
        this._configureComponent(route.page);
      }
      this.route_recognizer.add([{
        path:    route.path,
        handler: this._generateHandler(route)
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
    let err = new Error("404 Not Found");
    err.path = path;
    err.status = 404;
    return Promise.reject(err);
  }

  handlePath(path) {
    let recognized_route = this.route_recognizer.recognize(path);
    if (!recognized_route) return this.unrecognizedRouteHandler(path);
    let {handler, params} = recognized_route[0];
    return handler(params)
    .then(() => Promise.resolve(params))
    .catch(err => {
      let e = new Error(`Could not handle path '${path}': ${err.message || err}`);
      e.original_error = err;
      e.params         = params;
      return Promise.reject(e);
    });
  }
}
