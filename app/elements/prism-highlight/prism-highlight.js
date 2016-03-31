(function() {
'use strict';
/* global Prism */

class PrismHighlight {
  beforeRegister() {
    this.is = 'prism-highlight';
    this.properties = {
      /**
       * A data to be highlighted and dispayed.
       */
      code: String,
      /**
       * Prism supported language.
       */
      lang: String,
      /**
       * A list of tokenized code.
       * It's a result of calling `Prism.tokenize` function.
       */
      tokenized: {
        type: Array,
        readOnly: true
      },
      /**
       * True if not all data has been displayed in the display.
       */
      hasMore: {
        type: Boolean,
        readOnly: true,
        computed: '_computeHasMore(tokenized)'
      },
      /**
       * A number of lined to display at once.
       * After the limit is reached the display will show "load next [maxRead] items" and
       * "load all" buttons.
       */
      maxRead: {
        type: Number,
        value: 1000
      }
    };
  }

  get observers() {
    return [
      '_highlight(code, lang)'
    ];
  }

  _highlight(data, lang) {
    // console.info('_highlight called for lang', lang);
    this._setTokenized(undefined);
    this.$.output.innerHTML = '';

    if (!data) {
      //clean up
    } else {
      let highlight = (lang) => {
        console.time('Prism highlight time');
        Prism.hooks.run('before-highlight', {
          code: data,
          grammar: lang
        });
        let array = Prism.tokenize(data, lang);
        console.timeEnd('Prism highlight time');
        this._setTokenized(array);
        this._loadNext();
      };
      this._detectLang(data, lang)
      .then(highlight)
      .catch(() => {
        highlight(Prism.languages.markup);
      });
    }
  }

  /**
   * Display next tokens from `this.tokenized` list - up to `this.maxRead` elements.
   * If after running this function the `this.tokenized` array is empty it will be set to undefined.
   */
  _loadNext() {
    if (!this.tokenized || this.tokenized.length === 0) {
      return;
    }
    console.time('Prism tokens parsing and display time');
    var tokens = this.splice('tokenized', 0, this.maxRead);
    this._display(tokens);
    console.timeEnd('Prism tokens parsing and display time');
    if (this.tokenized.length === 0) {
      this._setTokenized(undefined);
    }
  }

  _loadAll() {
    var tokens = this.tokenized;
    this._setTokenized(undefined);
    this._display(tokens);
  }

  _display(tokens) {
    var html = Prism.Token.stringify(Prism.util.encode(tokens));
    this.$.output.innerHTML += html;
  }

  _computeHasMore(tokenized) {
    if (!tokenized || tokenized.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Guess proper language parser for given code and mime type (lang).
   *
   * @param {string} code The source being highlighted.
   * @param {string=} lang A mime type.
   * @return {!prism.Lang}
   */
  _detectLang(code, lang) {
    // console.log('Detecting lang for: ', lang);
    if (!lang) {
      // console.log('Lang detected: html');
      return Promise.resolve(Prism.languages.html);
    }
    if (lang.indexOf('html') !== -1) {
      // console.log('Lang detected: html');
      return Promise.resolve(Prism.languages.html);
    }
    if (lang.indexOf('js') !== -1 || lang.indexOf('es') === 0) {
      // console.log('Lang detected: javascript');
      return Promise.resolve(Prism.languages.javascript);
    } else if (lang.indexOf('css') !== -1) {
      // console.log('Lang detected: css');
      return Promise.resolve(Prism.languages.css);
    } else if (lang === 'c') {
      // console.log('Lang detected: clike');
      return Promise.resolve(Prism.languages.clike);
    } else {
      return this.loadLang(lang);
    }
  }

  loadLang(mime) {
    // console.log('Loading lang: ' + mime);
    if (!mime) {
      // console.log('Lang detected: html');
      return Promise.resolve(Prism.languages.html);
    }
    {
      //text/html; charset=ISO-8859-2
      let i = mime.indexOf('/');
      if (i !== -1) {
        mime = mime.substr(i + 1);
        i = mime.indexOf(';');
        if (i !== -1) {
          mime = mime.substr(i + 1).trim();
        }
      }
    }
    if (mime.toLowerCase().indexOf('x-') === 0) {
      mime = mime.substr(2);
    }
    if (Prism.plugins.mods.langs.indexOf(mime) === -1) {
      // console.log('No lang found for mime: ', mime);
      // console.log('Lang detected: html');
      return Promise.resolve(Prism.languages.html);
    }
    if (mime in Prism.languages) {
      return Promise.resolve(Prism.languages[mime]);
    }
    return this.loadLanguage(mime)
      .then(() => Prism.languages[mime]);
  }
  /**
   * A port from prism-autoloader.js
   */
  loadLanguage(lang) {
    var dependencies = Prism.plugins.mods.dependencies[lang];
    if (dependencies && dependencies.length) {
      return this.loadLanguages(dependencies)
      .then(() => this._loadLanguage(lang));
    }
    return this._loadLanguage(lang);
  }
  /**
   * A port from prism-autoloader.js
   */
  loadLanguages(langs) {
    if (typeof langs === 'string') {
      langs = [langs];
    }
    var promises = [];
    langs.forEach((lang) => {
      promises.push(this.loadLanguage(lang));
    });
    return Promise.all(promises);
  }

  _loadLanguage(lang) {
    return new Promise((resolve, reject) => {
      if (lang.indexOf('!') !== -1) {
        lang = lang.replace('!', '');
      }
      var s = document.createElement('script');
      s.src = this.languagePath(lang);
      s.async = true;
      s.onload = function() {
        document.body.removeChild(s);
        resolve();
      };
      s.onerror = function() {
        document.body.removeChild(s);
        reject();
      };
      document.body.appendChild(s);
    });
  }

  languagePath(lang) {
    return Prism.plugins.mods.path +
      'prism-' + lang + '.min.js';
  }

  _handleLinks(e) {
    var el = e.target;
    if (el.nodeName !== 'A') {
      return;
    }
    e.preventDefault();

    var url = el.href;
    this.fire('action-link-change', {
      url: url
    });
  }
}
Polymer(PrismHighlight);
})();
