(function() {
  'use strict';
  /*******************************************************************************
   * Copyright 2012 Pawel Psztyc
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not
   * use this file except in compliance with the License. You may obtain a copy of
   * the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
   * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
   * License for the specific language governing permissions and limitations under
   * the License.
   ******************************************************************************/

  /**
   * Advanced Rest Client namespace
   */
  window.arc = window.arc || {};
  /**
   * ARC app's namespace
   */
  arc.app = arc.app || {};
  /**
   * A namespace for the file importer / exporter.
   */
  arc.app.router = arc.app.router || {};
  /**
   * List of functions to call before route change.
   */
  arc.app.router._middle = new Set();
  arc.app.router._routes = new Map();
  /**
   * Register middle finction that will be called each time when the route change.
   */
  arc.app.router.middle = function(...callback) {
    callback.forEach((item) => arc.app.router._middle.add(item));
  };

  arc.app.router.register = function(path, callback) {
    arc.app.router._routes.set(path, callback);
  };
  /**
   * Handler for hash change.
   */
  arc.app.router.onHash = function(e) {
    var route = e.newURL;
    var hashIndex = route.indexOf('#');
    if (hashIndex === -1) {
      arc.app.router.redirect('/');
      return;
    }
    route = route.substr(hashIndex).replace('#!', '');

    var call = arc.app.router.getRoute(route);
    if (!call) {
      console.warn(`Route "${route}" not found.`);
      arc.app.router.redirect('/');
      return;
    }
    var params = {
      params: {}
    };
    var parts = arc.app.router.parse(call);
    var copy = String(route);
    parts.forEach((item) => {
      if (typeof item === 'string') {
        copy = copy.replace(item, '');
        return;
      }
      copy = copy.substr(1);
      // let paramValue = copy.match(new RegExp(item.pattern))[0];
      let match = copy.match(/[^\/]+/);
      if (match) {
        let paramValue = copy.match(/[^\/]+/)[0];
        copy = copy.replace('/' + paramValue, '');
        params.params[item.name] = paramValue;
      } else {
        params.params[item.name] = copy;
      }
    });
    params.path = parts[0].substr(1);
    var clb = arc.app.router._routes.get(call);
    var fns = Array.from(arc.app.router._middle);
    fns.push(clb);
    arc.app.router.callCallback(params, fns);
  };

  arc.app.router.callCallback = function(params, arr) {
    var fn = arr.shift();
    if (!fn) {
      return;
    }
    fn(params, () => {
      arc.app.router.callCallback(params, arr);
    });
  };

  arc.app.router.redirect = function(to) {
    to = String(to);
    if (!to) {
      to = '/';
    }
    if (to[0] !== '/') {
      to = '/' + to;
    }
    location.hash = '!' + to;
  };

  arc.app.router.start = () => {
    window.addEventListener('hashchange', arc.app.router.onHash);
    arc.app.router.onHash({
      newURL: location.href
    });
  };

  arc.app.router.getRoute = function(route) {
    var keys = arc.app.router._routes.keys();
    for (let def of keys) {
      var paramIndex = def.indexOf(':');
      if (paramIndex === -1) {
        if (def === route) {
          return def;
        }
        continue;
      }
      if (route.indexOf(def.substr(0, paramIndex)) === 0) {
        return def;
      }
    }
  };
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');
  /**
   * Parse a string for the raw tokens.
   *
   * @param  {String} str
   * @return {Array}
   */
  arc.app.router.parse = function(str) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var res;

    while ((res = PATH_REGEXP.exec(str)) !== null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue;
      }

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var suffix = res[6];
      var asterisk = res[7];

      var repeat = suffix === '+' || suffix === '*';
      var optional = suffix === '?' || suffix === '*';
      var delimiter = prefix || '/';
      var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: pattern.replace(/([=!:$\/()])/g, '\\$1')
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }
    return tokens;
  };
}());
