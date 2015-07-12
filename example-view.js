import SiteRouter from './example-router';

class SiteViewModel {
  constructor() {
    this.router = new SiteRouter(this);
    this.title = ko.observable();
    ko.applyBindings(this);
  }
  navigateTo(path, opts={}) {
    this.router.handlePath(path).catch(err => {
      // 404 is handled by the `unrecognizedRouteHandler`, so we can just ignore it here
      if (err.status !== 404) console.log(err, err.original_error);
    });
  }
}

window.SiteViewModel = SiteViewModel;
