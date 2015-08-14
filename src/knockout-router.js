import assert from 'assert';
import RouteRecognizer from 'route-recognizer';

if (!Object.assign)
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value(target) {
      var to, i, nextSource, keysArray, nextIndex, len, nextKey, desc;
      if (target === void 0 || target === null)
        throw new TypeError('Cannot convert first argument to object');
      to = Object(target);
      for (i = 1; i < arguments.length; i++) {
        nextSource = arguments[i];
        if (nextSource === void 0 || nextSource === null) continue;
        nextSource = Object(nextSource);
        keysArray = Object.keys(Object(nextSource));
        for (nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          nextKey = keysArray[nextIndex];
          desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });

/**
 * Utility to determine the handler and bind it to the router
 * @param {router} The Router instance
 * @param {handler} A string representing the name of a method
 * @return {handlerFn} The function specified by `handler`, bound to router
*/

function getHandlerFunctionForRoute(router, handler) {
  assert(typeof handler === 'string' || typeof handler === 'function', '`handler` should be either string or function');
  let handlerFn;
  if (typeof handler === 'string') {
    handlerFn = router[handler] || router.app[handler];
    assert(handlerFn, `Cannot find method ${handler} on the router or on the the main view model`);
  } else
    handlerFn = handler;
  return handlerFn.bind(router);
}

/**
 * Utility to set up a route's handler function with pre/post hooks
 * @param {router} The Router instance
 * @param {route} A route object from the `routes` array passed to the Router constructor
 * @return {handleFn} The function to be called when route is matched
*/

function generateHandler(router, route) {
  const {path, handler: handler_name, page} = route;
  const handlerFn = getHandlerFunctionForRoute(router, handler_name);
  let {meta} = route;
  if (!meta) meta = {};
  meta.path = path;
  return route_params => {
    const attenuated_params = Object.assign({meta}, route_params);
    return Promise.resolve()
    .then(() => router.preHandle(attenuated_params))
    .then(() => handlerFn(attenuated_params))
    .then(component_params => Promise.all([
      router.postHandle(attenuated_params),
      new Promise(resolve => {
        if (page) {
          router.current_page(page.name);
          router.current_params(component_params);
        } else {
          router.current_page(void 0);
          router.current_params(void 0);
        }
        resolve();
      })
    ]))
    .then(() => Promise.resolve(attenuated_params));
  };
}

/**
 * Utility to verify and register a knockout component
 * Components must have `name` (String) and `template` (String) properties
 * @param {component_view_model} The component to verify/register
*/

function configureComponent(component_vm) {
  const {name, template} = component_vm;
  assert(name, `Cannot register component without \`name\` property; please define static method ${component_vm.constructor.name}.name`);
  assert(template, `Cannot register component without \`template\` property; please define static method ${component_vm.constructor.name}.template`);
  if (!ko.components.isRegistered(name))
    ko.components.register(name, {
      viewModel: component_vm,
      template
    });
}

/**
 * Router class
 * @param {app} The main application view model
 * @param {routes} Array of route objects {path(string,required), handler(string|function), page(class|function,required), meta(object)}
*/

export default class Router {
  constructor(app, routes) {
    assert(app && routes, 'Router requires parameters: app (Object) and routes (Array)');
    this.app = app;
    this.routes = routes;
    this.route_recognizer = new RouteRecognizer();
    this.current_page = ko.observable();
    this.current_params = ko.observable();
    for (const route of routes) {
      if (route.page) configureComponent(route.page);
      this.route_recognizer.add([{
        path: route.path,
        handler: generateHandler(this, route)
      }]);
    }
  }
  preHandle() { // path, handler, params
    return new Promise(resolve => {
      // console.log('prehandler', {path, params});
      resolve();
    });
  }
  postHandle() { // path, handler, params
    return new Promise(resolve => {
      // console.log('posthandler', {path, params});
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
    const route_params = Object.assign(params, opts);
    return handler(route_params)
    .then(attenuated_params => Promise.resolve(attenuated_params))
    .catch(err => {
      const e = new Error(`Could not handle path '${path}': ${err.message || err}`);
      e.original_error = err;
      e.params = route_params;
      return Promise.reject(e);
    });
  }
}
