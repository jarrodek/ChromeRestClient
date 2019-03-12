/**
 * Main component for ARC Chrome app.
 *
 * @appliesMixin ArcComponents.ArcAppMixin
 */
class ArcChrome extends ArcComponents.ArcAppMixin(Polymer.Element) {
  /* global chrome, ArcComponents */
  static get is() {
    return 'arc-chrome';
  }

  static get properties() {
    return {
      /**
       * A reference to the variables open button.
       * @type {String}
       */
      _variablesButton: Object,
      /**
       * A logger
       */
      log: {
        type: Object,
        value: function() {
          return console;
        }
      },

      _variablesOverlayOpened: {
        type: Boolean,
        observer: '_varsOverlayChanged'
      },

      appMenuDisabled: {
        type: Boolean,
        reflectToAttribute: true,
        computed: '_computeAppMenuDisabled(menuConfig.*)',
      },
      /**
       * Computed value. When `true` it renders `back` button instead of menu.
       * @type {Boolean}
       */
      renderBackButton: {
        type: Boolean,
        value: false,
        computed: '_computeRenderBackButton(page)'
      },
      /**
       * Automatically set via media queries.
       * When set it renders narrow wiew.
       * This also affects API console.
       */
      narrow: {
        type: Boolean
      },
      /**
       * Currently opened application screen
       * @type {String}
       */
      page: {type: String, value: 'request', observer: '_pageChanged'},
      /**
       * Received from layout elements narrow state.
       */
      narrowLayout: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * When set the infor center drawer is opened.
       */
      messageCenterOpened: Boolean,
      /**
       * OAuth 2 redirect URI to be used when authorizing the request.
       */
      _oauth2redirectUri: {
        type: String,
        computed: '_computeRedirectUri(config.oauth2redirectUri)'
      },
      /**
       * When true the requests are proxied by ARC extension.
       */
      proxyEnabled: {
        type: Boolean,
        observer: '_proxyChanged'
      },
      /**
       * Google Analytics client ID parameter.
       */
      gaCid: String,
      /**
       * True if the user is signed into Chrome.
       * Some features are not available when user is not signed in.
       */
      chromeSignedIn: Boolean,
      /**
       * Google access token for Drive.
       */
      driveAccessToken: String
    };
  }

  static get observers() {
    return [
      '_routeDataChanged(page, routeParams.*)',
      '_telemetryChanged(telemetry)'
    ];
  }

  constructor() {
    super();
    this._openExternalHandler = this._openExternalHandler.bind(this);
    this._copyContentHandler = this._copyContentHandler.bind(this);
    // this._apiDataHandler = this._apiDataHandler.bind(this);
    // this._processStartHandler = this._processStartHandler.bind(this);
    // this._processStopHandler = this._processStopHandler.bind(this);
    // this._processErrorHandler = this._processErrorHandler.bind(this);
    // this._exchangeAssetHandler = this._exchangeAssetHandler.bind(this);
    this.openWorkspace = this.openWorkspace.bind(this);
    this._googleAuthRequest = this._googleAuthRequest.bind(this);
    this.openLicense = this.openLicense.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('open-external-url', this._openExternalHandler);
    window.addEventListener('content-copy', this._copyContentHandler);
    // window.addEventListener('process-loading-start', this._processStartHandler);
    // window.addEventListener('process-loading-stop', this._processStopHandler);
    // window.addEventListener('process-error', this._processErrorHandler);
    // window.addEventListener('api-data-ready', this._apiDataHandler);
    // this.addEventListener('process-exchange-asset-data', this._exchangeAssetHandler);
    this.addEventListener('request-workspace-append', this.openWorkspace);
    window.addEventListener('workspace-open-project-requests', this.openWorkspace);
    window.addEventListener('google-autorize', this._googleAuthRequest);
    window.addEventListener('display-license', this.openLicense);
    Polymer.RenderStatus.afterNextRender(this, () => {
      this._variablesButton = this.shadowRoot.querySelector('#varToggleButton');
      this._scrollTarget = this.$.scrollingRegion.$.contentContainer;
    });
  }

  _routeDataChanged(page, changeRecord) {
    const params = changeRecord.base;
    switch (page) {
      case 'request':
        this._setupRequest(params);
        break;
      case 'project':
        this._setupProject(params);
        break;
    }
  }

  /**
   * Loads a page component when page changes.
   * @param {String} page Current page
   */
  _pageChanged(page) {
    let id;
    let path;
    let isLocal;
    switch (page) {
      case 'request':
        id = 'arc-request-workspace';
        path = 'arc-request-workspace/arc-request-workspace';
        break;
      case 'project':
        id = 'project-details';
        path = 'project-details/project-details';
        break;
      case 'host-rules':
        id = 'host-rules-editor';
        path = 'host-rules-editor/host-rules-editor';
        break;
      case 'cookie-manager':
        id = 'cookie-manager';
        path = 'cookie-manager/cookie-manager';
        break;
      case 'settings':
        id = 'arc-settings-panel';
        path = 'arc-settings-panel/arc-settings-panel';
        break;
      case 'about':
        isLocal = true;
        id = 'about-arc-chrome';
        break;
      case 'socket':
        id = 'websocket-panel';
        path = 'websocket-panel/websocket-panel';
        break;
      case 'drive':
        id = 'google-drive-browser';
        path = 'google-drive-browser/google-drive-browser';
        break;
      case 'data-import':
        id = 'import-panel';
        path = 'import-panel/import-panel';
        break;
      case 'data-export':
        id = 'export-panel';
        path = 'export-panel/export-panel';
        break;
      case 'history':
        id = 'history-panel';
        path = 'history-panel/history-panel';
        break;
      case 'saved':
        id = 'saved-requests-panel';
        path = 'saved-requests-panel/saved-requests-panel';
        break;
      case 'themes-panel':
        id = 'themes-panel';
        path = 'themes-panel/themes-panel';
        break;
      default:
        console.error(`The base route ${page} is not recognized`);
        return;
    }
    const cls = window.customElements.get(id);
    if (cls) {
      return;
    }
    let p;
    if (isLocal) {
      p = this._loadLocalComponent(id);
    } else {
      p = this._loadComponent(path);
    }
    p.catch((cmp) => this._reportComponentLoadingError(cmp));
  }

  initApplication() {
    Polymer.RenderStatus.afterNextRender(this, () => this.initSettings({}));
    Polymer.RenderStatus.afterNextRender(this, () => this.updateStyles({}));
    Polymer.RenderStatus.afterNextRender(this, () => this._requestAuthToken(false));
    const hash = location.hash.substr(1);
    if (hash) {
      this.page = hash;
    }
  }

  _setupRequest(params) {
    if (!params) {
      return;
    }
    const {id, type} = params;
    if (!type || !this.$.workspace.addEmptyRequest) {
      this.log.info('arc-chrome(app)::_setupRequest::Missing use case implementation?');
      return;
    }
    if (!type || type === 'new') {
      if (this.$.workspace.addEmptyRequest) {
        this.$.workspace.addEmptyRequest();
      } else {
        this.log.info('arc-chrome(app)::_setupRequest::Missing use case implementation?');
      }
      return;
    }
    if (params.type === 'latest' || !params.id) {
      return;
    }
    this.$.requestModel.read(type, id)
    .then((request) => {
      const index = this.$.workspace.findRequestIndex(request._id);
      if (index === -1) {
        this.$.workspace.appendRequest(request);
      } else {
        this.$.workspace.updateRequestObject(request, index);
        this.$.workspace.selected = index;
      }
    })
    .catch((cause) => {
      this.log.warn('Restoring request:', cause);
    });
  }

  _setupProject(params) {
    if (!params) {
      return;
    }
    this.$.projectDetails.projectId = params.id;
  }

  _computeVarDisabled(enabled) {
    if (enabled === undefined) {
      return false;
    }
    return !enabled;
  }
  /**
   * Sets `newMessages` propert depending if messaging service detected
   * new messages.
   *
   * @param {CustomEvent} e
   */
  _unreadMessagesChanged(e) {
    const state = !!(e.detail.value && e.detail.value.length > 0);
    this.set('newMessages', state);
  }
  /**
   * Opens the info center drawwer.
   */
  openInfoCenter() {
    this.messageCenterOpened = !this.messageCenterOpened;
    if (this.messageCenterOpened) {
      this.$.msgService.readMessages();
      window.setTimeout(() => {
        this.$.msgService.unread.forEach((item, i) => {
          this.$.msgService.set(['unread', i, 'read'], 1);
        });
      }, 4000);
    }
  }
  /**
   * Closes the info center drawwer.
   */
  closeInfoCenter() {
    this.messageCenterOpened = false;
  }
  /**
   * Handles `open-external-url` event from ARC components.
   * @param {CustomEvent} e
   */
  _openExternalHandler(e) {
    e.preventDefault();
    console.warn('FIXME');
    // ipcRenderer.send('open-external-url', e.detail.url);
  }
  /**
   * Handles new window open request.
   */
  onNewWindow() {
    console.warn('FIXME');
    // ipcRenderer.send('new-window');
  }
  /**
   * Handles `clipboard-copy` event from ARC components.
   * The `clipboard` api is loaded in the preload script.
   *
   * @param {CustomEvent} e
   */
  _copyContentHandler(e) {
    console.warn('FIXME');
    // clipboard.writeText(e.detail.value);
    e.preventDefault();
  }
  /**
   * The overlay is not included by default in the view so it loads the
   * component first and then renders it. Subsequent opens do not require
   * inluding the comonent.
   *
   * @param {Boolean} val
   */
  _varsOverlayChanged(val) {
    if (val && !window.customElements.get('variables-preview-overlay')) {
      this._loadComponent('variables-preview-overlay/variables-preview-overlay')
      .catch((cmp) => this._reportComponentLoadingError(cmp));
    }
  }

  _variablesOpenRequest(e) {
    e.stopPropagation();
    this._variablesOverlayOpened = false;
    this._loadComponent('variables-drawer-editor/variables-drawer-editor')
    .then(() => {
      this.$.environmentsDrawer.opened = true;
    })
    .catch((cmp) => this._reportComponentLoadingError(cmp));
  }

  _variablesPreviewClosed() {
    if (this._variablesOverlayOpened) {
      this._variablesOverlayOpened = false;
    }
  }

  /**
   * Computes value for `appMenuDisabled` property.
   * @param {Object} record Polymer's change record for `menuConfig`
   * @return {Boolean}
   */
  _computeAppMenuDisabled(record) {
    if (!record || !record.base) {
      return false;
    }
    const mc = record.base;
    if (mc.menuDisabled) {
      return true;
    }
    if (mc.hideHistory && mc.hideSaved && mc.hideProjects && mc.hideApis) {
      return true;
    }
    return false;
  }
  /**
   * Computes value for `renderBackButton` property.
   * @param {String} page Current page value
   * @return {Boolean}
   */
  _computeRenderBackButton(page) {
    return !page || page !== 'request';
  }
  /**
   * Handler for the "back" icon click in main navigation.
   */
  _backHandler() {
    this.openWorkspace();
  }

  /**
   * Computes value for `oauth2RedirectUri` property. It is either configuration
   * option or default value.
   * @param {?String} redirectUri Configuration value for redirect URI.
   * @return {String} Redirect URI to be used.
   */
  _computeRedirectUri(redirectUri) {
    return redirectUri ? redirectUri : 'https://auth.advancedrestclient.com/oauth-popup.html';
  }

  _loadLocalComponent(cmp) {
    return new Promise((resolve, reject) => {
      const path = `elements/${cmp}/${cmp}.html`;
      this._loadingSources = true;
      Polymer.importHref(path, () => {
        this._loadingSources = false;
        resolve();
      }, () => {
        this._loadingSources = false;
        reject(cmp);
      }, true);
    });
  }

  _proxyChanged(value) {
    if (!this.hasProxyInstalled && value) {
      this._loadLocalComponent('install-proxy-dialog')
      .then(() => {
        this.shadowRoot.querySelector('install-proxy-dialog').opened = true;
      });
      return;
    }
    window.ARC_USE_PROXY = value;
    this.dispatchEvent(new CustomEvent('send-analytics', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'event',
        category: 'Request',
        action: 'Use XHR',
        label: value + ''
      }
    }));
  }

  _proxyConnectedChanged(e) {
    this.hasProxyInstalled = e.detail.value;
  }

  registerProxyMessageHandler(handler) {
    this._proxyMessageHandler = handler;
  }

  _onProxyMessage(e) {
    if (this._proxyMessageHandler) {
      this._proxyMessageHandler(e);
    }
  }

  _navMenuSelect(e) {
    const {page} = e.detail.item.dataset;
    this.page = page;
    e.target.selected = undefined;
  }

  _telemetryChanged(telemetry) {
    if (!telemetry) {
      return;
    }
    this._restoreGa();
  }

  _restoreGa() {
    return this._restoreGaChrome()
    .then((data) => {
      if (!data['ga.cid']) {
        return this._restoreGaIdb();
      }
      return {
        cid: data['ga.cid']
      };
    })
    .then((data) => {
      if (!data || !data.cid) {
        this._generateGaCid();
      } else {
        this.gaCid = data.cid;
        Polymer.RenderStatus.afterNextRender(this, () => {
          this._telemetryScreen();
        });
      }
    });
  }

  _restoreGaChrome() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('ga.cid', (r) => resolve(r));
    });
  }

  _restoreGaIdb() {
    return new Promise((resolve) => {
      const db = new PouchDB('analytics-meta');
      db.get('metadata').then((r) => resolve(r))
      .catch(() => resolve());
    });
  }

  _generateGaCid() {
    const gen = document.createElement('uuid-generator');
    const cid = gen.generate();
    const storeObj = {
      'ga.cid': cid
    };
    chrome.storage.sync.set(storeObj, () => {});
    this.gaCid = cid;
    Polymer.RenderStatus.afterNextRender(this, () => {
      this._telemetryScreen();
    });
  }

  _chromeSignin(e) {
    this.dispatchEvent(new CustomEvent('google-signin-success', {
      bubbles: true,
      composed: true,
      detail: {
        scope: e.target.scope,
        token: e.detail.token
      }
    }));
  }

  _chromeSignout(e) {
    this.dispatchEvent(new CustomEvent('google-signout', {
      bubbles: true,
      composed: true,
      detail: {
        scope: e.target.scope
      }
    }));
  }

  openChromeSigninInfo() {
    let node = document.querySelector('chrome-not-signedin-view');
    if (!node) {
      node = document.createElement('chrome-not-signedin-view');
      document.body.appendChild(node);
    }
    node.opened = true;
  }

  _googleAuthRequest(e) {
    const aware = this.$.signInAware;
    const scope = e.detail.scope;
    if (!aware.signedIn) {
      this.dispatchEvent(new CustomEvent('google-signout', {
        bubbles: true,
        composed: true,
        detail: {
          scope
        }
      }));
      this.openChromeSigninInfo();
      return;
    }
    aware.scope = scope;
    if (aware.needAdditionalAuth) {
      aware.signIn();
    } else {
      this.dispatchEvent(new CustomEvent('google-signin-success', {
        bubbles: true,
        composed: true,
        detail: {
          scope,
          token: aware.accessToken
        }
      }));
    }
  }

  _requestAuthToken(interactive, scope) {
    const aware = this.$.signInAware;
    if (interactive) {
      if (!aware.signedIn) {
        this.dispatchEvent(new CustomEvent('google-signout', {
          bubbles: true,
          composed: true,
          detail: {
            scope
          }
        }));
        this.openChromeSigninInfo();
        return;
      }
    }
    aware.signIn(interactive);
  }

  _openDriveRequest(e) {
    const file = new Blob([e.detail.content], {type: 'application/json'});
    this.dispatchEvent(new CustomEvent('import-process-file', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        file,
        diveId: e.detail.diveId
      }
    }));
  }

  /**
   * Opens license dialog.
   */
  openLicense() {
    this._loadComponent('arc-license-dialog/arc-license-dialog')
    .then(() => {
      const node = this.shadowRoot.querySelector('arc-license-dialog');
      node.opened = true;
    })
    .catch((cmp) => this._reportComponentLoadingError(cmp));
  }

  /**
   * @TODO: Move it to app mixin.
   */
  closeActiveTab() {
    this.workspace.closeActiveTab();
  }

  /**
   * Handler for `popup-menu`. Sends command to the IO process.
   * IO process informs windows to hide the menu.
   * @param {CustomEvent} e
   */
  _popupMenuHandler(e) {
    const {type} = e.detail;
    let sizing;
    const menu = this.shadowRoot.querySelector('arc-menu');
    if (menu) {
      const rect = menu.getBoundingClientRect();
      sizing = {
        height: rect.height,
        width: rect.width
      };
    }
    console.log('POPUP MENU DETATCH', type, sizing);
    // ipcRenderer.send('popup-app-menu', type, sizing);
  }
}

window.customElements.define('arc-chrome', ArcChrome);
