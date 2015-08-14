import Router from 'knockout-router';
import {assert} from 'chai';
// import util from 'util';

class AppViewModel {
  handleSomePath(params) {
    return Promise.resolve({the_params: params});
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

describe('Router instance', () => {
  let app, routes, router;
  beforeEach(() => {
    app = new AppViewModel();
    routes = [
      {path: '/some-path', handler: 'handleSomePath', page: SomePageComponent, meta: {foo: 'bar'}},
      {path: '/some-path/:some_param', handler: 'handleSomePath', page: SomePageComponent, meta: {foo: 'bar'}}
    ];
    router = new Router(app, routes);
  });
  describe('#handlePath', () => {
    it('rejects for unrecognized paths', (done) => {
      router.handlePath('/foobar').catch(err => {
        assert(err);
        assert.equal(err.message, "404 Not Found");
        done();
      });
    });
    it('resolves for recognized paths', (done) => {
      router.handlePath('/some-path').then(() => {
        done();
      });
    });
    it('resolves with meta information', () => {
      return router.handlePath('/some-path').then((params) => {
        assert.equal(params.meta.foo, 'bar');
        return Promise.resolve();
      });
    });
    it('resolves with route params', () => {
      return router.handlePath('/some-path/foobar').then((params) => {
        assert.equal(params.some_param, 'foobar');
        return Promise.resolve();
      });
    });
  });
});
