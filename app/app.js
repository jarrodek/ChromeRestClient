/**
 * Class responsible for initializing the main ARC elements
 * and setup base options.
 */
class ArcInit {
  /**
   * Reference to the main application window.
   *
   * @return {HtmlElement}
   */
  get app() {
    return document.getElementById('app');
  }

  /**
   * Initialized the application when window is ready.
   *
   * @return {Promise}
   */
  initApp() {
    return this._createApp()
    .then(() => this.removeLoader())
    .then(() => console.log('Application window is now ready.'))
    .catch((cause) => this.reportFatalError(cause));
    // // console.info('Initializing renderer window...');
    // const opts = {};
    // if (this.initConfig.workspacePath) {
    //   opts.filePath = this.initConfig.workspacePath;
    // }
    // this.workspaceManager = new WorkspaceManager(this.workspaceIndex, opts);
    // this.workspaceManager.observe();
    // let appConfig;
    // return this.prefProxy.load()
    // .then((cnf) => {
    //   appConfig = cnf;
    //   return this._createApp(cnf);
    // })
    // .then(() => {
    //   return this.themeManager.loadTheme(appConfig.theme)
    //   // Theme is not a fatal error
    //   .catch(() => {});
    // })
    // .catch((cause) => this.reportFatalError(cause));
  }

  /**
   * Creates application main element.
   * @return {Promise} Promise resolved when element is loaded and ready
   * rendered.
   */
  _createApp() {
    if (this.created) {
      return Promise.resolve();
    }
    return this._importHref('src/arc-chrome.html')
    .then(() => {
      const app = document.createElement('arc-chrome');
      app.id = 'app';
      this._setupApp(app);
      document.body.appendChild(app);
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
   * @param {ArcElectron} app App electron element.
   */
  _setupApp(app) {
    // console.info('Initializing ARC app');
    // app.componentsDir = this.initConfig.appComponents;
    // app.appVersion = versionInfo.appVersion;
    // app.browserVersion = versionInfo.chrome;
    app.initApplication();
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
}
const initScript = new ArcInit();
initScript.initApp();
