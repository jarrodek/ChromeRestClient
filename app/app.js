import {WorkspaceState} from './scripts/libs/workspace-state.js';
import {ArcPreferences} from './scripts/libs/preferences.js';
import {ArcChromeTransport} from './scripts/libs/transport/request-transport.js';
import {CookieStore} from './scripts/libs/cookie-store.js';
/**
 * Class responsible for initializing the main ARC elements
 * and setup base options.
 */
class ArcInit {
  constructor() {
    this.prefs = new ArcPreferences();
    this.transport = new ArcChromeTransport();
    this.cookieStore = new CookieStore();
  }

  listen() {
    this.prefs.observe();
    this.transport.observe();
    this.cookieStore.observe();
  }
  /**
   * Reference to the main application window.
   *
   * @return {HtmlElement}
   */
  get app() {
    return document.getElementById('app');
  }

  requestSate() {
    chrome.runtime.sendMessage({
      payload: 'window-initial-state-read'
    }, (state) => this.initApp(state));
  }

  /**
   * Initialized the application when window is ready.
   *
   * @param {Object} state Window init state object received from the main thread.
   * @return {Promise}
   */
  initApp(state) {
    this.workspaceState = new WorkspaceState(String(state.index));
    this.workspaceState.listen();
    let appConfig;
    return this.prefs.load()
    .then((config) => {
      appConfig = config;
      return this._createApp(config);
    })
    .then(() => {
      return this.loadTheme(appConfig.theme)
      // Theme is not a fatal error
      .catch(() => {
        console.warn('Theme import error');
      });
    })
    .then(() => this.removeLoader())
    .then(() => console.log('Application window is now ready.'))
    .catch((cause) => this.reportFatalError(cause));
  }

  /**
   * Creates application main element.
   * @param {Object} config Current configuration.
   * @return {Promise} Promise resolved when element is loaded and ready
   * rendered.
   */
  _createApp(config) {
    if (this.created) {
      return Promise.resolve();
    }
    return this._importHref('src/arc-chrome.html')
    .then(() => {
      const app = document.createElement('arc-chrome');
      app.id = 'app';
      app.config = config;
      this._setupApp(app);
      document.body.appendChild(app);
      app.registerProxyMessageHandler(this.transport.onProxyMessage.bind(this.transport));
      this.created = true;
    });
  }

  _importHref(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'import';
      link.href = href;
      link.setAttribute('import-href', '');
      link.setAttribute('async', '');
      const callbacks = {
        load: function() {
          callbacks.cleanup();
          resolve();
        },
        error: function() {
          callbacks.cleanup();
          reject();
        },
        cleanup: function() {
          link.removeEventListener('load', callbacks.load);
          link.removeEventListener('error', callbacks.error);
        }
      };
      link.addEventListener('load', callbacks.load);
      link.addEventListener('error', callbacks.error);
      document.head.appendChild(link);
    });
  }
  /**
   * Sets up the application properties.
   *
   * @param {ArcChrome} app App Chrome element.
   */
  _setupApp(app) {
    // console.info('Initializing ARC app');
    // app.componentsDir = this.initConfig.appComponents;
    /* global chrome */
    app.appVersion = chrome.runtime.getManifest().version;
    app.appId = chrome.runtime.id;
    app.browserVersion = this.getChromeVersion();
    app.appChannel = this.getReleaseChannel();
    app.initApplication();
  }

  getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom[e|ium]\/([0-9\.]+)/);
    return raw ? raw[1] : '(not set)';
  }

  getReleaseChannel() {
    const manifest = chrome.runtime.getManifest();
    const manifestName = manifest.version_name;
    let release;
    if (manifestName.indexOf('beta') !== -1) {
      release = 'beta';
    } else if (manifestName.indexOf('dev') !== -1) {
      release = 'dev';
    } else if (manifestName.indexOf('canary') !== -1) {
      release = 'canary';
    } else {
      release = 'stable';
    }
    return release;
  }
  /**
   * Reports fatal application error.
   *
   * @param {Error} err Error object
   */
  reportFatalError(err) {
    console.error(err);
  }

  removeLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) {
      return;
    }
    loader.classList.add('end');
    setTimeout(() => {
      loader.parentNode.removeChild(loader);
    }, 150);
  }

  loadTheme(theme) {
    const defaultTheme = 'arc-electron-default-theme';
    if (!theme) {
      theme = defaultTheme;
    }
    return this._loadTheme(theme)
    .catch((cause) => {
      console.warn(cause);
      return this._loadTheme(defaultTheme);
    });
  }

  _loadTheme(theme) {
    const url = `bower_components/${theme}/${theme}.html`;
    return new Promise((resolve) => {
      // Apparently Polymer handles imports with `<custom-styles>`
      // automatically and inserts it into the head section
      const nodes = document.head.children;
      let removeNextCustomStyle = false;
      let linkNode;
      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        if (node.nodeName === 'LINK' && node.rel === 'import' &&
          node.href && node.href.indexOf('theme') !== -1) {
          removeNextCustomStyle = true;
          linkNode = node;
          continue;
        }
        if (removeNextCustomStyle && node.nodeName === 'CUSTOM-STYLE') {
          node.parentNode.removeChild(node);
          linkNode.parentNode.removeChild(linkNode);
          break;
        }
      }
      Polymer.importHref(url, () => {
        Polymer.RenderStatus.afterNextRender(this, () => {
          Polymer.updateStyles({});
          resolve();
        });
      }, () => {
        console.error(`Unable to load theme definition for ${theme}.`);
        resolve();
      }, true);
    });
  }
}
const initScript = new ArcInit();
initScript.requestSate();
initScript.listen();
