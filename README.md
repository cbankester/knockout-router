# knockout-router

A Knockout.js router using components & templates for pages

## Usage

### Install:

```bash
bower install --save knockout-component-router
```

### Setup:

See [knockout-router-example](https://github.com/cbankester/knockout-router-example) for a detailed demonstration. In short:

* Create a `routes` array with each element being an object with the following properties:
  * `path` (string, required) - The path to trigger the route
    * Parsed by the excellent [route-recognizer](https://github.com/tildeio/route-recognizer) library
  * `handler` (string|function) - The logic to be run upon route trigger
    * If string (e.g. `"userShowHandler"`), `handler` corresponds to a method defined on the router
    * If function, `handler` will be `bind`ed (`bound`?) to the router
  * `page` (class|function, required) - The component to be used used/displayed when this route triggers
  * `meta` (object) - Additional information to be passed to the handlers (i.e. `handler`, `preHandle` and `postHandle`)
    * NB: This provides a really convenient way to dynamically perform different actions within your handlers based on which route was triggered. See [the example application](https://github.com/cbankester/knockout-router-example) for more information


* Create a `SiteRouter` which extends `Router`, optionally overloading the following methods:
  * `preHandle` - Called before the router handles a path
    * For async stuff, return a Promise
  * `postHandle` - Called immediately after the router handles a path
  * `unrecognizedRouteHandler` -  Called when the router encounters an unregistered path
    * By default, it throws an `Error` with the property `status = 200`, allowing you to `catch` the error and respond appropriately


* In your Router's constructor, take in the application view model as a parameter
  * Pass the app and your app's routes to `super`, i.e. with `super(app, routes);`


* Add page handlers to your router by defining methods:
  * E.g. `userShowHandler` - Called immediately after the `preHandle` method
  * The return value of the page handlers is passed directly to the component for initialization
    * For async stuff, return a promise


* In your root application view model, interact with the router like so:
  * Instantiate the router with `this.router = new SiteRouter(this);`
  * Trigger a route with `router.handlePath(path, opts)`, where `path` is a string and `opts` is an optional object
    * `opts` will be merged with the params generated from the routes and will overwrite keys with the same name

And that's pretty much it!

See [the example application](https://github.com/cbankester/knockout-router-example) for a more detailed and thorough explanation of how to integrate and use the router.
