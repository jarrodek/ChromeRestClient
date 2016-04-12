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
  arc.app.logger._hasFile = false;
  // See http://tobyho.com/2012/07/27/taking-over-console-log/
  arc.app.logger.initConsole = function() {
    var methods = ['log', 'warn', 'error'];
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
        i.dont.exist += 0;
      } catch (e) {
        let lines = e.stack.split('\n');
        for (var i = 0, len = lines.length; i < len; i++) {
          callstack.push(lines[i]);
        }
        callstack.splice(0, 2);
      }
      arc.app.logger.handleLog(method, callstack, arr);
      original.apply(console, arguments);
    };
  };

  arc.app.logger.handleLog = (method, stack, args) => {
    if (args && args[0] && args[0] === '--no-save') {
      return;
    }
    // return;
    //var log = [].concat([method, stack, Date.now()], args);
    var log = {
      'type': method,
      'stack': stack,
      'time': Date.now(),
      'args': args
    };
    if (!arc.app.logger._hasFile) {
      arc.app.logger.logs.push(log);
      return;
    }
    if (arc.app.logger.logs.length === 0) {
      arc.app.logger.fileLoggerSave(log);
    } else {
      arc.app.logger.logs.push(log);
      arc.app.logger.fileLoggerNext();
    }
  };

  arc.app.logger.initFileLogger = () => {
    if (arc.app.logger._hasFile) {
      return;
    }
    var elm = document.querySelector('#logfile');
    if (!elm) {
      return;
    }
    arc.app.logger._hasFile = true;
    arc.app.logger._fileHandler = elm;
    elm.addEventListener('save', arc.app.logger.fileLoggerSaved);
    elm.addEventListener('error', arc.app.logger.fileLoggerError);
    elm.addEventListener('file-read', arc.app.logger.fileLoggerRead);
  };

  arc.app.logger.fileLoggerNext = () => {
    if (arc.app.logger.logs && arc.app.logger.logs.length > 0) {
      arc.app.logger.fileLoggerSave(arc.app.logger.logs.shift());
    }
  };

  arc.app.logger.fileLoggerSave = (log) => {
    var str = JSON.stringify(log) + ',';
    arc.app.logger._fileHandler.content = str;
    arc.app.logger._fileHandler.append();
  };

  arc.app.logger.fileLoggerSaved = (e) => {
    console.log('--no-save','fileLoggerSave', e);
    arc.app.logger.fileLoggerNext();
  };
  arc.app.logger.fileLoggerError = (e) => {
    console.log('--no-save','fileLoggerError', e);
    arc.app.logger.fileLoggerNext();
  };
  arc.app.logger.fileLoggerRead = (e) => {
    var content = e.detail.content;
    if (content.substr(content.length - 1) === ',') {
      content = content.substr(0, content.length - 1);
    }
    content = '[' + content + ']';
    try {
      content = JSON.parse(content);
    } catch (e1) {
      console.log('--no-save','fileLoggerRead error', e1);
      return;
    }
    console.log('--no-save','fileLoggerRead', content);
  };
})();
