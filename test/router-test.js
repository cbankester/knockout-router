import Router from 'knockout-router';
import {assert} from 'chai';
import {stub} from 'sinon';
// import util from 'util';

class AppViewModel {
  handleSomePath(params) {
    return Promise.resolve({the_params: params});
  }
}

class AppViewModelWithRouter extends AppViewModel {
  constructor(routes) {
    super();
    this.router = new Router(this, routes);
  }
}

class SomePageComponent {
  static get name() {
    return 'some-page';
  }
  static get template() {
    return 'some-page-template';
  }
}

describe('Router', () => {
  it('cannot be instanciated without parameters', () => {
    assert.throws(() => new Router(), "Router requires parameters: app (Object) and routes (Array)");
  });
  it('cannot be instanciated without routes', () => {
    assert.throws(() => new Router({}), "Router requires parameters: app (Object) and routes (Array)");
  });
  it('does not allow components without `name` property as pages', () => {
    const app = new AppViewModel();
    const routes = [{path: 'foo', handler: 'handleSomePath', page: class Foo {static get name() {}}}];
    assert.throws(() => new Router(app, routes), /Cannot register component without `name` property/);
  });
  it('does not allow components without `template` property as pages', () => {
    const app = new AppViewModel();
    const routes = [{path: 'foo', handler: 'handleSomePath', page: class Foo {}}];
    assert.throws(() => new Router(app, routes), /Cannot register component without `template` property/);
  });
});

const default_routes = [
  {path: '/some-path', handler: 'handleSomePath', page: SomePageComponent, meta: {foo: 'bar'}},
  {path: '/some-path/:some_param', handler: 'handleSomePath', page: SomePageComponent, meta: {foo: 'bar'}}
];

describe('Router instance', () => {
  describe('#handlePath', () => {
    it('rejects for unrecognized paths', (done) => {
      (new AppViewModelWithRouter(default_routes)).router.handlePath('/foobar').catch(err => {
        assert(err);
        assert.equal(err.message, "404 Not Found");
        done();
      });
    });
    it('resolves for recognized paths', (done) => {
      (new AppViewModelWithRouter(default_routes)).router.handlePath('/some-path').then(() => {
        done();
      });
    });
    it('resolves with meta information', () => {
      return (new AppViewModelWithRouter(default_routes)).router.handlePath('/some-path').then((params) => {
        assert.equal(params.meta.foo, 'bar');
        return Promise.resolve();
      });
    });
    it('resolves with route params', () => {
      return (new AppViewModelWithRouter(default_routes)).router.handlePath('/some-path/foobar').then((params) => {
        assert.equal(params.some_param, 'foobar');
        return Promise.resolve();
      });
    });
    it('sets current_page to the name of the route\'s component', () => {
      const router = new AppViewModelWithRouter(default_routes).router;
      return router.handlePath('/some-path/foobar').then(() => {
        assert.equal(router.current_page(), 'some-page');
        return Promise.resolve();
      });
    });
    it('sets current_params to the output of handler', () => {
      const router = new AppViewModelWithRouter(default_routes).router;
      return router.handlePath('/some-path/foobar').then(() => {
        assert.deepEqual(router.current_params(), {the_params: {some_param: 'foobar', meta: {foo: 'bar'}}});
        return Promise.resolve();
      });
    });
  });
  describe('#preHandle', () => {
    it('is called before the route\'s handler is called', (done) => {
      let pre_handler_called = false;
      class AppRouter extends Router {
        preHandle(...args) {
          pre_handler_called = true;
        }
      }
      const app         = new AppViewModelWithRouter(default_routes),
            router      = app.router,
            pre_handler = router.preHandle,
            handler     = app.handleSomePath;
      stub(router, 'preHandle', (...args) => {
        pre_handler_called = true;
        pre_handler(...args);
      });
      stub(app, 'handleSomePath', (...args) => {
        assert(pre_handler_called);
        handler(...args);
        done();
      });
      router.handlePath('/some-path/foobar');
    });
  });
});
