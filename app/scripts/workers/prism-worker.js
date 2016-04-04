'use strict';

self.document = {
  'currentScript': null,
  getElementsByTagName: function() {
    return [];
  }
};
importScripts(
  '/bower_components/prism/prism.js',
  '/bower_components/prism/plugins/autolinker/prism-autolinker.min.js',
  'prism-modes.js'
);

/**
 * Load a grammar with its dependencies
 * @param {string} lang
 */
var loadLanguage = function(lang) {
  var dependencies = Prism.plugins.mods.dependencies[lang];
  if (dependencies && dependencies.length) {
    loadLanguages(dependencies);
  }
  if (lang.indexOf('!') >= 0) {
    lang = lang.replace('!', '');
  }
  var src = getLanguagePath(lang);
  importScripts(src);
};
/**
 * Sequentially loads an array of grammars.
 * @param {string[]|string} langs
 * @param {function=} success
 * @param {function=} error
 */
var loadLanguages = function(langs, success, error) {
  if (typeof langs === 'string') {
    langs = [langs];
  }
  langs.forEach(function(lang) {
    loadLanguage(lang);
  });
};
function getLanguagePath(lang) {
  return Prism.plugins.mods.path + 'prism-' + lang + '.min.js';
}
Prism.plugins.mods.langs.forEach(function(lang) {
  loadLanguage(lang);
});
/**
 * Guess proper language parser for given code and mime type (lang).
 *
 * @param {string} code The source being highlighted.
 * @param {string=} lang A mime type.
 * @return {!prism.Lang}
 */
function detectLang(code, lang) {
  // console.log('Detecting lang for: ', lang);
  if (!lang) {
    // console.log('Lang detected: html');
    return Prism.languages.html;
  }
  if (lang.indexOf('html') !== -1) {
    // console.log('Lang detected: html');
    return Prism.languages.html;
  }
  if (lang.indexOf('js') !== -1 || lang.indexOf('es') === 0) {
    // console.log('Lang detected: javascript');
    return Prism.languages.javascript;
  } else if (lang.indexOf('css') !== -1) {
    // console.log('Lang detected: css');
    return Prism.languages.css;
  } else if (lang === 'c') {
    // console.log('Lang detected: clike');
    return Prism.languages.clike;
  }
  {
    // text/html; charset=ISO-8859-2
    // application/vnd.dart;charset=utf-8
    // text/x-java-source;charset=utf-8
    let i = mime.indexOf('/');
    if (i !== -1) {
      mime = mime.substr(i + 1);
      i = mime.indexOf(';');
      if (i !== -1) {
        mime = mime.substr(0, i).trim();
      }
    }
  }
  // remove "vnd." prefix
  if (mime.indexOf('vnd.') === 0) {
    mime = mime.substr(4);
  }
  if (mime.toLowerCase().indexOf('x-') === 0) {
    mime = mime.substr(2);
  }
  var srcI = mime.toLowerCase().indexOf('-source');
  if (srcI > 0) {
    mime = mime.substr(0, srcI);
  }
  if (Prism.plugins.mods.langs.indexOf(mime) === -1) {
    // console.log('No lang found for mime: ', mime);
    // console.log('Lang detected: html');
    return Prism.languages.html;
  }
  if (mime in Prism.languages) {
    return Prism.languages[mime];
  }
  return Prism.languages.html;
}

function tokenize(data) {
  var lang = data.language;
  var code = data.code;
  lang = detectLang(code, lang);
  Prism.hooks.run('before-highlight', {
    code: code,
    grammar: lang
  });
  return Prism.tokenize(code, lang);
}
function makeTokens(obj) {
  if (obj instanceof Array) {
    return obj.map(makeTokens);
  } else if (typeof obj === 'string') {
    return obj;
  } else {
    return new Prism.Token(obj.type, makeTokens(obj.content || ''), obj.alias);
  }
}
function stringify(data) {
  var data = makeTokens(data.tokens);
  return Prism.Token.stringify(Prism.util.encode(data));
}
self.onmessage = function(e) {
  var data = e.data;
  var result = {
    payload: data.payload
  };
  switch (data.payload) {
    case 'tokenize':
      result.tokens = tokenize(data);
      break;
    case 'stringify':
      result.html = stringify(data);
      break;
  }
  self.postMessage(result);
};
