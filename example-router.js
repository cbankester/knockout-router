import KORouter from './ko-router';
import PersonViewModel from './pages/person';

const site_routes = [
  {
    path: '/person/:name',
    handler: 'personHandler',
    page: PersonViewModel,
    meta: {replace_state: true}
  }
]

export default class SiteRouter extends KORouter {
  constructor(app) {
    super(app, site_routes);
  }

  personHandler(params) {
    this.app.title(`Person ${params.name}`);
    return Promise.resolve({name: params.name});
  }

  unrecognizedRouteHandler(path) {
    // this.app.loadView(404);
    console.log('404\'d');
    return super.unrecognizedRouteHandler(path);
  }
  preHandle(path, handler, params) {
    return super.preHandle(path, handler, params).then(() => {
      if (params.replace_state) {
        delete params.replace_state;
        // window.history.replaceState({handler, params}, null, path);
      } else {
        // window.history.pushState({handler, params}, null, path);
      }
    });
  }
}
