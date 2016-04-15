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
  var console = window.console;
  /**
   * Advanced Rest Client namespace
   */
  window.arc = window.arc || {};
  /**
   * ARC app's namespace
   */
  arc.app = arc.app || {};
  /**
   * A namespace for the logger.
   */
  arc.app.logger = arc.app.logger || {};
  arc.app.logger.logs = [];
  arc.app.logger._db = null;
  // See http://tobyho.com/2012/07/27/taking-over-console-log/
  arc.app.logger.initConsole = function() {
    var methods = ['log', 'warn', 'error', 'info'];
    methods.forEach(function(method) {
      arc.app.logger._intercept(method);
    });
  };

  arc.app.logger._intercept = function(method) {
    var original = console[method];
    console[method] = function() {
      let arr = Array.from(arguments);
      let callstack = [];
      try {
        o.dont.exist += 0;
      } catch (e) {
        let lines = e.stack.split('\n');
        for (var i = 0, len = lines.length; i < len; i++) {
          callstack.push(lines[i]);
        }
        callstack.splice(0, 2);
      }
      let noSave = arr && arr[0] && arr[0] === '--no-save';
      if (noSave) {
        Array.prototype.shift.apply(arguments);
      }
      original.apply(console, arguments);
      if (!noSave) {
        arc.app.logger.handleLog(method, callstack, arr);
      }
    };
  };

  arc.app.logger.handleLog = (method, stack, args) => {
    var log = {
      'type': method,
      'stack': stack,
      'time': Date.now(),
      'logs': JSON.stringify(args) //to avoid objects that
    };
    if (!arc.app.logger._db) {
      arc.app.logger.logs.push(log);
    } else {
      arc.app.logger.appendLog(log);
    }
  };

  arc.app.logger.initDbLogger = () => {
    if (arc.app.logger._db) {
      return;
    }
    arc.app.db.idb.open().then((db) => {
      db.transaction('rw', db.logs, function*() {
        var deleteCount = yield db.logs
          .reverse()
          .offset(200)
          .delete();
        console.log('--no-save','Cleared: ' + deleteCount + ' logs');
      }).catch((e) => {
        console.error('--no-save', e);
      })
      .finally(() => {
        arc.app.logger._db = db;
        arc.app.logger.nextLog();
      });

    });
  };

  arc.app.logger.nextLog = () => {
    if (arc.app.logger.logs && arc.app.logger.logs.length > 0) {
      arc.app.logger.appendLog(arc.app.logger.logs.shift());
    }
  };

  arc.app.logger.appendLog = (log) => {
    //console.log('--no-save','fileLoggerSave', e);
    arc.app.logger._db.logs.add(log)
    .then(() => arc.app.logger.nextLog())
    .catch((e) => {
      console.log('--no-save','fileLoggerSave', e);
    });
  };
})();
