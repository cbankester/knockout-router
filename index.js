/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _routeRecognizer = __webpack_require__(1);

	var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

	var Router = (function () {
	  _createClass(Router, [{
	    key: '_configureComponent',
	    value: function _configureComponent(component_vm) {
	      var name = component_vm.name;
	      var template = component_vm.template;

	      console.log({ name: name, template: template });
	      if (!name) throw new Error('Cannot register component without a name; please define static method ' + component_vm.constructor.name + '.name');
	      if (!template) throw new Error('Cannot register component without template; please define static method ' + component_vm.constructor.name + '.template');
	      ko.components.register(name, {
	        viewModel: component_vm,
	        template: template
	      });
	    }
	  }, {
	    key: '_generateHandler',
	    value: function _generateHandler(route) {
	      var _this = this;

	      var path = route.path;
	      var handler = route.handler;
	      var meta = route.meta;
	      var controller = route.controller;
	      var page = route.page;

	      if ('string' !== typeof handler && 'function' !== typeof handler) {
	        throw new Error('`handler` should be either string or function');
	      }
	      if (!controller) controller = this;
	      if (!meta) meta = {};
	      return function (params) {
	        var attenuated_params = Object.assign(meta, params);
	        return Promise.resolve().then(function () {
	          return _this.preHandle(path, handler, attenuated_params);
	        }).then(function () {
	          return ('string' === typeof handler ? controller[handler].bind(controller) : handler.bind(controller))(attenuated_params);
	        }).then(function (component_params) {
	          if (page) {
	            _this.current_page(page.name);
	            _this.current_params(attenuated_params);
	          } else {
	            _this.current_page(void 0);
	            _this.current_params(void 0);
	          }
	        }).then(function () {
	          return _this.postHandle(path, handler, attenuated_params);
	        });
	      };
	    }
	  }]);

	  function Router(app, routes) {
	    _classCallCheck(this, Router);

	    this.app = app;
	    this.routes = routes;
	    this.route_recognizer = new _routeRecognizer2['default']();
	    this.current_page = ko.observable();
	    this.current_params = ko.observable();
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var route = _step.value;

	        if (route.page) {
	          this._configureComponent(route.page);
	        }
	        this.route_recognizer.add([{
	          path: route.path,
	          handler: this._generateHandler(route)
	        }]);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }

	  _createClass(Router, [{
	    key: 'preHandle',
	    value: function preHandle(path, handler) {
	      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      return new Promise(function (resolve) {
	        console.log('prehandler', { path: path, params: params });
	        resolve();
	      });
	    }
	  }, {
	    key: 'postHandle',
	    value: function postHandle(path, handler) {
	      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      return new Promise(function (resolve) {
	        console.log('posthandler', { path: path, params: params });
	        resolve();
	      });
	    }
	  }, {
	    key: 'unrecognizedRouteHandler',
	    value: function unrecognizedRouteHandler(path) {
	      var err = new Error('404 Not Found');
	      err.path = path;
	      err.status = 404;
	      return Promise.reject(err);
	    }
	  }, {
	    key: 'handlePath',
	    value: function handlePath(path) {
	      var recognized_route = this.route_recognizer.recognize(path);
	      if (!recognized_route) return this.unrecognizedRouteHandler(path);
	      var _recognized_route$0 = recognized_route[0];
	      var handler = _recognized_route$0.handler;
	      var params = _recognized_route$0.params;

	      return handler(params).then(function () {
	        return Promise.resolve(params);
	      })['catch'](function (err) {
	        var e = new Error('Could not handle path \'' + path + '\': ' + (err.message || err));
	        e.original_error = err;
	        e.params = params;
	        return Promise.reject(e);
	      });
	    }
	  }]);

	  return Router;
	})();

	exports['default'] = Router;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	(function () {
	  "use strict";
	  function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
	    this.path = path;
	    this.matcher = matcher;
	    this.delegate = delegate;
	  }

	  $$route$recognizer$dsl$$Target.prototype = {
	    to: function to(target, callback) {
	      var delegate = this.delegate;

	      if (delegate && delegate.willAddRoute) {
	        target = delegate.willAddRoute(this.matcher.target, target);
	      }

	      this.matcher.add(this.path, target);

	      if (callback) {
	        if (callback.length === 0) {
	          throw new Error("You must have an argument in the function passed to `to`");
	        }
	        this.matcher.addChild(this.path, target, callback, this.delegate);
	      }
	      return this;
	    }
	  };

	  function $$route$recognizer$dsl$$Matcher(target) {
	    this.routes = {};
	    this.children = {};
	    this.target = target;
	  }

	  $$route$recognizer$dsl$$Matcher.prototype = {
	    add: function add(path, handler) {
	      this.routes[path] = handler;
	    },

	    addChild: function addChild(path, target, callback, delegate) {
	      var matcher = new $$route$recognizer$dsl$$Matcher(target);
	      this.children[path] = matcher;

	      var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);

	      if (delegate && delegate.contextEntered) {
	        delegate.contextEntered(target, match);
	      }

	      callback(match);
	    }
	  };

	  function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
	    return function (path, nestedCallback) {
	      var fullPath = startingPath + path;

	      if (nestedCallback) {
	        nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
	      } else {
	        return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
	      }
	    };
	  }

	  function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
	    var len = 0;
	    for (var i = 0, l = routeArray.length; i < l; i++) {
	      len += routeArray[i].path.length;
	    }

	    path = path.substr(len);
	    var route = { path: path, handler: handler };
	    routeArray.push(route);
	  }

	  function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
	    var routes = matcher.routes;

	    for (var path in routes) {
	      if (routes.hasOwnProperty(path)) {
	        var routeArray = baseRoute.slice();
	        $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);

	        if (matcher.children[path]) {
	          $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
	        } else {
	          callback.call(binding, routeArray);
	        }
	      }
	    }
	  }

	  var $$route$recognizer$dsl$$default = function $$route$recognizer$dsl$$default(callback, addRouteCallback) {
	    var matcher = new $$route$recognizer$dsl$$Matcher();

	    callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));

	    $$route$recognizer$dsl$$eachRoute([], matcher, function (route) {
	      if (addRouteCallback) {
	        addRouteCallback(this, route);
	      } else {
	        this.add(route);
	      }
	    }, this);
	  };

	  var $$route$recognizer$$specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];

	  var $$route$recognizer$$escapeRegex = new RegExp("(\\" + $$route$recognizer$$specials.join("|\\") + ")", "g");

	  function $$route$recognizer$$isArray(test) {
	    return Object.prototype.toString.call(test) === "[object Array]";
	  }

	  // A Segment represents a segment in the original route description.
	  // Each Segment type provides an `eachChar` and `regex` method.
	  //
	  // The `eachChar` method invokes the callback with one or more character
	  // specifications. A character specification consumes one or more input
	  // characters.
	  //
	  // The `regex` method returns a regex fragment for the segment. If the
	  // segment is a dynamic of star segment, the regex fragment also includes
	  // a capture.
	  //
	  // A character specification contains:
	  //
	  // * `validChars`: a String with a list of all valid characters, or
	  // * `invalidChars`: a String with a list of all invalid characters
	  // * `repeat`: true if the character specification can repeat

	  function $$route$recognizer$$StaticSegment(string) {
	    this.string = string;
	  }
	  $$route$recognizer$$StaticSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      var string = this.string,
	          ch;

	      for (var i = 0, l = string.length; i < l; i++) {
	        ch = string.charAt(i);
	        callback({ validChars: ch });
	      }
	    },

	    regex: function regex() {
	      return this.string.replace($$route$recognizer$$escapeRegex, "\\$1");
	    },

	    generate: function generate() {
	      return this.string;
	    }
	  };

	  function $$route$recognizer$$DynamicSegment(name) {
	    this.name = name;
	  }
	  $$route$recognizer$$DynamicSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "/", repeat: true });
	    },

	    regex: function regex() {
	      return "([^/]+)";
	    },

	    generate: function generate(params) {
	      return params[this.name];
	    }
	  };

	  function $$route$recognizer$$StarSegment(name) {
	    this.name = name;
	  }
	  $$route$recognizer$$StarSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "", repeat: true });
	    },

	    regex: function regex() {
	      return "(.+)";
	    },

	    generate: function generate(params) {
	      return params[this.name];
	    }
	  };

	  function $$route$recognizer$$EpsilonSegment() {}
	  $$route$recognizer$$EpsilonSegment.prototype = {
	    eachChar: function eachChar() {},
	    regex: function regex() {
	      return "";
	    },
	    generate: function generate() {
	      return "";
	    }
	  };

	  function $$route$recognizer$$parse(route, names, types) {
	    // normalize route as not starting with a "/". Recognition will
	    // also normalize.
	    if (route.charAt(0) === "/") {
	      route = route.substr(1);
	    }

	    var segments = route.split("/"),
	        results = [];

	    for (var i = 0, l = segments.length; i < l; i++) {
	      var segment = segments[i],
	          match;

	      if (match = segment.match(/^:([^\/]+)$/)) {
	        results.push(new $$route$recognizer$$DynamicSegment(match[1]));
	        names.push(match[1]);
	        types.dynamics++;
	      } else if (match = segment.match(/^\*([^\/]+)$/)) {
	        results.push(new $$route$recognizer$$StarSegment(match[1]));
	        names.push(match[1]);
	        types.stars++;
	      } else if (segment === "") {
	        results.push(new $$route$recognizer$$EpsilonSegment());
	      } else {
	        results.push(new $$route$recognizer$$StaticSegment(segment));
	        types.statics++;
	      }
	    }

	    return results;
	  }

	  // A State has a character specification and (`charSpec`) and a list of possible
	  // subsequent states (`nextStates`).
	  //
	  // If a State is an accepting state, it will also have several additional
	  // properties:
	  //
	  // * `regex`: A regular expression that is used to extract parameters from paths
	  //   that reached this accepting state.
	  // * `handlers`: Information on how to convert the list of captures into calls
	  //   to registered handlers with the specified parameters
	  // * `types`: How many static, dynamic or star segments in this route. Used to
	  //   decide which route to use if multiple registered routes match a path.
	  //
	  // Currently, State is implemented naively by looping over `nextStates` and
	  // comparing a character specification against a character. A more efficient
	  // implementation would use a hash of keys pointing at one or more next states.

	  function $$route$recognizer$$State(charSpec) {
	    this.charSpec = charSpec;
	    this.nextStates = [];
	  }

	  $$route$recognizer$$State.prototype = {
	    get: function get(charSpec) {
	      var nextStates = this.nextStates;

	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        var child = nextStates[i];

	        var isEqual = child.charSpec.validChars === charSpec.validChars;
	        isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

	        if (isEqual) {
	          return child;
	        }
	      }
	    },

	    put: function put(charSpec) {
	      var state;

	      // If the character specification already exists in a child of the current
	      // state, just return that state.
	      if (state = this.get(charSpec)) {
	        return state;
	      }

	      // Make a new state for the character spec
	      state = new $$route$recognizer$$State(charSpec);

	      // Insert the new state as a child of the current state
	      this.nextStates.push(state);

	      // If this character specification repeats, insert the new state as a child
	      // of itself. Note that this will not trigger an infinite loop because each
	      // transition during recognition consumes a character.
	      if (charSpec.repeat) {
	        state.nextStates.push(state);
	      }

	      // Return the new state
	      return state;
	    },

	    // Find a list of child states matching the next character
	    match: function match(ch) {
	      // DEBUG "Processing `" + ch + "`:"
	      var nextStates = this.nextStates,
	          child,
	          charSpec,
	          chars;

	      // DEBUG "  " + debugState(this)
	      var returned = [];

	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        child = nextStates[i];

	        charSpec = child.charSpec;

	        if (typeof (chars = charSpec.validChars) !== "undefined") {
	          if (chars.indexOf(ch) !== -1) {
	            returned.push(child);
	          }
	        } else if (typeof (chars = charSpec.invalidChars) !== "undefined") {
	          if (chars.indexOf(ch) === -1) {
	            returned.push(child);
	          }
	        }
	      }

	      return returned;
	    }

	    /** IF DEBUG
	    , debug: function() {
	      var charSpec = this.charSpec,
	          debug = "[",
	          chars = charSpec.validChars || charSpec.invalidChars;
	       if (charSpec.invalidChars) { debug += "^"; }
	      debug += chars;
	      debug += "]";
	       if (charSpec.repeat) { debug += "+"; }
	       return debug;
	    }
	    END IF **/
	  };

	  /** IF DEBUG
	  function debug(log) {
	    console.log(log);
	  }
	   function debugState(state) {
	    return state.nextStates.map(function(n) {
	      if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
	      return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
	    }).join(", ")
	  }
	  END IF **/

	  // This is a somewhat naive strategy, but should work in a lot of cases
	  // A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
	  //
	  // This strategy generally prefers more static and less dynamic matching.
	  // Specifically, it
	  //
	  //  * prefers fewer stars to more, then
	  //  * prefers using stars for less of the match to more, then
	  //  * prefers fewer dynamic segments to more, then
	  //  * prefers more static segments to more
	  function $$route$recognizer$$sortSolutions(states) {
	    return states.sort(function (a, b) {
	      if (a.types.stars !== b.types.stars) {
	        return a.types.stars - b.types.stars;
	      }

	      if (a.types.stars) {
	        if (a.types.statics !== b.types.statics) {
	          return b.types.statics - a.types.statics;
	        }
	        if (a.types.dynamics !== b.types.dynamics) {
	          return b.types.dynamics - a.types.dynamics;
	        }
	      }

	      if (a.types.dynamics !== b.types.dynamics) {
	        return a.types.dynamics - b.types.dynamics;
	      }
	      if (a.types.statics !== b.types.statics) {
	        return b.types.statics - a.types.statics;
	      }

	      return 0;
	    });
	  }

	  function $$route$recognizer$$recognizeChar(states, ch) {
	    var nextStates = [];

	    for (var i = 0, l = states.length; i < l; i++) {
	      var state = states[i];

	      nextStates = nextStates.concat(state.match(ch));
	    }

	    return nextStates;
	  }

	  var $$route$recognizer$$oCreate = Object.create || function (proto) {
	    function F() {}
	    F.prototype = proto;
	    return new F();
	  };

	  function $$route$recognizer$$RecognizeResults(queryParams) {
	    this.queryParams = queryParams || {};
	  }
	  $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
	    splice: Array.prototype.splice,
	    slice: Array.prototype.slice,
	    push: Array.prototype.push,
	    length: 0,
	    queryParams: null
	  });

	  function $$route$recognizer$$findHandler(state, path, queryParams) {
	    var handlers = state.handlers,
	        regex = state.regex;
	    var captures = path.match(regex),
	        currentCapture = 1;
	    var result = new $$route$recognizer$$RecognizeResults(queryParams);

	    for (var i = 0, l = handlers.length; i < l; i++) {
	      var handler = handlers[i],
	          names = handler.names,
	          params = {};

	      for (var j = 0, m = names.length; j < m; j++) {
	        params[names[j]] = captures[currentCapture++];
	      }

	      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
	    }

	    return result;
	  }

	  function $$route$recognizer$$addSegment(currentState, segment) {
	    segment.eachChar(function (ch) {
	      var state;

	      currentState = currentState.put(ch);
	    });

	    return currentState;
	  }

	  function $$route$recognizer$$decodeQueryParamPart(part) {
	    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
	    part = part.replace(/\+/gm, "%20");
	    return decodeURIComponent(part);
	  }

	  // The main interface

	  var $$route$recognizer$$RouteRecognizer = function $$route$recognizer$$RouteRecognizer() {
	    this.rootState = new $$route$recognizer$$State();
	    this.names = {};
	  };

	  $$route$recognizer$$RouteRecognizer.prototype = {
	    add: function add(routes, options) {
	      var currentState = this.rootState,
	          regex = "^",
	          types = { statics: 0, dynamics: 0, stars: 0 },
	          handlers = [],
	          allSegments = [],
	          name;

	      var isEmpty = true;

	      for (var i = 0, l = routes.length; i < l; i++) {
	        var route = routes[i],
	            names = [];

	        var segments = $$route$recognizer$$parse(route.path, names, types);

	        allSegments = allSegments.concat(segments);

	        for (var j = 0, m = segments.length; j < m; j++) {
	          var segment = segments[j];

	          if (segment instanceof $$route$recognizer$$EpsilonSegment) {
	            continue;
	          }

	          isEmpty = false;

	          // Add a "/" for the new segment
	          currentState = currentState.put({ validChars: "/" });
	          regex += "/";

	          // Add a representation of the segment to the NFA and regex
	          currentState = $$route$recognizer$$addSegment(currentState, segment);
	          regex += segment.regex();
	        }

	        var handler = { handler: route.handler, names: names };
	        handlers.push(handler);
	      }

	      if (isEmpty) {
	        currentState = currentState.put({ validChars: "/" });
	        regex += "/";
	      }

	      currentState.handlers = handlers;
	      currentState.regex = new RegExp(regex + "$");
	      currentState.types = types;

	      if (name = options && options.as) {
	        this.names[name] = {
	          segments: allSegments,
	          handlers: handlers
	        };
	      }
	    },

	    handlersFor: function handlersFor(name) {
	      var route = this.names[name],
	          result = [];
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }

	      for (var i = 0, l = route.handlers.length; i < l; i++) {
	        result.push(route.handlers[i]);
	      }

	      return result;
	    },

	    hasRoute: function hasRoute(name) {
	      return !!this.names[name];
	    },

	    generate: function generate(name, params) {
	      var route = this.names[name],
	          output = "";
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }

	      var segments = route.segments;

	      for (var i = 0, l = segments.length; i < l; i++) {
	        var segment = segments[i];

	        if (segment instanceof $$route$recognizer$$EpsilonSegment) {
	          continue;
	        }

	        output += "/";
	        output += segment.generate(params);
	      }

	      if (output.charAt(0) !== "/") {
	        output = "/" + output;
	      }

	      if (params && params.queryParams) {
	        output += this.generateQueryString(params.queryParams, route.handlers);
	      }

	      return output;
	    },

	    generateQueryString: function generateQueryString(params, handlers) {
	      var pairs = [];
	      var keys = [];
	      for (var key in params) {
	        if (params.hasOwnProperty(key)) {
	          keys.push(key);
	        }
	      }
	      keys.sort();
	      for (var i = 0, len = keys.length; i < len; i++) {
	        key = keys[i];
	        var value = params[key];
	        if (value == null) {
	          continue;
	        }
	        var pair = encodeURIComponent(key);
	        if ($$route$recognizer$$isArray(value)) {
	          for (var j = 0, l = value.length; j < l; j++) {
	            var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
	            pairs.push(arrayPair);
	          }
	        } else {
	          pair += "=" + encodeURIComponent(value);
	          pairs.push(pair);
	        }
	      }

	      if (pairs.length === 0) {
	        return "";
	      }

	      return "?" + pairs.join("&");
	    },

	    parseQueryString: function parseQueryString(queryString) {
	      var pairs = queryString.split("&"),
	          queryParams = {};
	      for (var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i].split("="),
	            key = $$route$recognizer$$decodeQueryParamPart(pair[0]),
	            keyLength = key.length,
	            isArray = false,
	            value;
	        if (pair.length === 1) {
	          value = "true";
	        } else {
	          //Handle arrays
	          if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
	            isArray = true;
	            key = key.slice(0, keyLength - 2);
	            if (!queryParams[key]) {
	              queryParams[key] = [];
	            }
	          }
	          value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : "";
	        }
	        if (isArray) {
	          queryParams[key].push(value);
	        } else {
	          queryParams[key] = value;
	        }
	      }
	      return queryParams;
	    },

	    recognize: function recognize(path) {
	      var states = [this.rootState],
	          pathLen,
	          i,
	          l,
	          queryStart,
	          queryParams = {},
	          isSlashDropped = false;

	      queryStart = path.indexOf("?");
	      if (queryStart !== -1) {
	        var queryString = path.substr(queryStart + 1, path.length);
	        path = path.substr(0, queryStart);
	        queryParams = this.parseQueryString(queryString);
	      }

	      path = decodeURI(path);

	      // DEBUG GROUP path

	      if (path.charAt(0) !== "/") {
	        path = "/" + path;
	      }

	      pathLen = path.length;
	      if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
	        path = path.substr(0, pathLen - 1);
	        isSlashDropped = true;
	      }

	      for (i = 0, l = path.length; i < l; i++) {
	        states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
	        if (!states.length) {
	          break;
	        }
	      }

	      // END DEBUG GROUP

	      var solutions = [];
	      for (i = 0, l = states.length; i < l; i++) {
	        if (states[i].handlers) {
	          solutions.push(states[i]);
	        }
	      }

	      states = $$route$recognizer$$sortSolutions(solutions);

	      var state = solutions[0];

	      if (state && state.handlers) {
	        // if a trailing slash was dropped and a star segment is the last segment
	        // specified, put the trailing slash back
	        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
	          path = path + "/";
	        }
	        return $$route$recognizer$$findHandler(state, path, queryParams);
	      }
	    }
	  };

	  $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;

	  $$route$recognizer$$RouteRecognizer.VERSION = "0.1.5";

	  var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

	  /* global define:true module:true window: true */
	  if ("function" === "function" && __webpack_require__(3)["amd"]) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return $$route$recognizer$$default;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== "undefined" && module["exports"]) {
	    module["exports"] = $$route$recognizer$$default;
	  } else if (typeof this !== "undefined") {
	    this["RouteRecognizer"] = $$route$recognizer$$default;
	  }
	}).call(undefined);

	//# sourceMappingURL=route-recognizer.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }
/******/ ]);