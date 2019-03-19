import {WorkspaceState} from './scripts/libs/workspace-state.js';
import {ArcPreferences} from './scripts/libs/preferences.js';
import {ArcChromeTransport} from './scripts/libs/transport/request-transport.js';
import {CookieStore} from './scripts/libs/cookie-store.js';
import {DriveFactory} from './scripts/libs/drive-factory.js';
import {FileFactory} from './scripts/libs/file-factory.js';
import {ThemesManager} from './scripts/libs/themes-manager.js';
import {AmfService} from './scripts/libs/amf-service.js';
import {ArcContextMenu} from './scripts/libs/context-actions.js';
import hotkeys from './scripts/libs/hotkeys.esm.js';
/**
 * Class responsible for initializing the main ARC elements
 * and setup base options.
 */
class ArcInit {
  constructor() {
    this.prefs = new ArcPreferences();
    this.transport = new ArcChromeTransport();
    this.cookieStore = new CookieStore();
    this.drive = new DriveFactory();
    this.file = new FileFactory();
    this.themes = new ThemesManager();
    this.amfService = new AmfService();
    this.contextMenu = new ArcContextMenu();
  }

  listen() {
    this.prefs.observe();
    this.transport.observe();
    this.transport.observeXhr();
    this.cookieStore.observe();
    this.drive.observe();
    this.file.observe();
    this.themes.observe();
    this.amfService.observe();
    this.contextMenu.observe();
    this.contextMenu.registerDefaultActions();
    this.setupKeyboard();
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
      return this.themes.loadTheme(appConfig.theme)
      // Theme is not a fatal error
      .catch((cause) => {
        console.warn('Theme import error', cause);
        console.info('Using unstyled ARC.');
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

  setupKeyboard() {
    hotkeys('ctrl+s, command+s', () => {
      this.app.saveOpened({
        source: 'shortcut'
      });
    });
    hotkeys('ctrl+shift+s, command+shift+s', () => {
      this.app.saveOpened();
    });
    hotkeys('ctrl+w, command+w', (e) => {
      e.preventDefault();
      this.app.closeActiveTab();
    });
    hotkeys('ctrl+enter, command+enter', () => {
      this.app.sendCurrentTab();
    });
    hotkeys('ctrl+t, command+t', () => {
      this.app.newRequestTab();
    });
    hotkeys('ctrl+o, command+o', () => {
      this.app.openSaved();
    });
    hotkeys('ctrl+,, command+,', () => {
      this.app.openSettings();
    });
    hotkeys('ctrl+d, command+d', () => {
      this.app.openDrivePicker();
    });
  }
}
const initScript = new ArcInit();
initScript.requestSate();
initScript.listen();
