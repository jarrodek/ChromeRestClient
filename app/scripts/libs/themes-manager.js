export class ThemesManager {
  constructor() {
    this._listAllHandler = this._listAllHandler.bind(this);
    this._activeInfoHandler = this._activeInfoHandler.bind(this);
    this._activateHandler = this._activateHandler.bind(this);

    this._dialogCancelHandler = this._dialogCancelHandler.bind(this);
    this._dialogConfirmHandler = this._dialogConfirmHandler.bind(this);
  }

  observe() {
    window.addEventListener('themes-list', this._listAllHandler);
    window.addEventListener('theme-active-info', this._activeInfoHandler);
    window.addEventListener('theme-activate', this._activateHandler);
  }

  _listAllHandler(e) {
    e.preventDefault();
    e.detail.result = this.list();
  }

  _activeInfoHandler(e) {
    e.preventDefault();
    e.detail.result = this.activeInfo();
  }

  _activateHandler(e) {
    e.preventDefault();
    e.detail.result = this.activate(e.detail.theme);
  }

  get defaultTheme() {
    return {
      name: 'default-theme',
      title: 'Default',
      description: 'ARC default theme.',
      isDefault: true,
      location: 'themes/default-theme/',
      mainFile: 'themes/default-theme/default-theme.html',
      version: '1.0.0',
      _id: 'default-theme'
    };
  }

  get anypointTheme() {
    return {
      name: 'anypoint-theme',
      title: 'Anypoint',
      description: 'Anypoint inspired theme for Advanced REST Client and API Console.',
      isDefault: true,
      location: 'themes/anypoint-theme/',
      mainFile: 'themes/anypoint-theme/anypoint-theme.html',
      version: '1.0.0',
      _id: 'anypoint-theme'
    };
  }

  get darkTheme() {
    return {
      name: 'dark-theme',
      title: 'Dark',
      description: 'Dark theme for Advanced REST Client and API Console.',
      isDefault: true,
      location: 'themes/dark-theme/',
      mainFile: 'themes/dark-theme/anypoint-theme.html',
      version: '1.0.0',
      _id: 'dark-theme'
    };
  }

  list() {
    const result = [
      this.defaultTheme,
      this.anypointTheme,
      this.darkTheme
    ];
    return Promise.resolve(result);
  }

  activeInfo() {
    let result;
    switch (this.activeThemeId) {
      case 'dark-theme': result = this.darkTheme; break;
      case 'anypoint-theme': result = this.anypointTheme; break;
      default: result = this.defaultTheme; break;
    }
    return Promise.resolve(result);
  }

  activate(id) {
    return this._dispatchStore(id)
    .then(() => {
      if (this.restartPending) {
        return;
      }
      this.restartPending = true;
      this._renderRestartDialog();
    });
  }

  loadTheme(id) {
    const defaultTheme = 'default-theme';
    if (!id) {
      id = defaultTheme;
    }
    this.activeThemeId = id;
    return this._loadTheme(id)
    .catch((cause) => {
      console.warn(cause);
      console.info('Using default theme.');
      this.activeThemeId = defaultTheme;
      return this._loadTheme(defaultTheme);
    });
  }

  _loadTheme(theme) {
    const url = `themes/${theme}/${theme}.html`;
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

  _dispatchStore(id) {
    const e = new CustomEvent('settings-changed', {
      bubbles: true,
      cancelable: true,
      detail: {
        name: 'theme',
        value: id
      }
    });
    document.body.dispatchEvent(e);
    return e.detail.result;
  }

  _renderRestartDialog() {
    const dialog = document.createElement('paper-dialog');
    const title = document.createElement('h2');
    title.innerText = 'Restart required';
    dialog.appendChild(title);
    const content = document.createElement('p');
    let msg = 'Theme change requires application restart. Current theme';
    msg += ' will be used until next restart.';
    content.innerText = msg;
    dialog.appendChild(content);
    const buttons = document.createElement('div');
    const b1 = document.createElement('paper-button');
    const b2 = document.createElement('paper-button');
    b1.setAttribute('dialog-dismiss', '');
    b1.innerText = 'Restart later';
    b2.setAttribute('dialog-confirm', '');
    b2.innerText = 'Restart now';
    buttons.appendChild(b1);
    buttons.appendChild(b2);
    dialog.appendChild(buttons);
    document.body.appendChild(dialog);
    dialog.opened = true;
    b1.addEventListener('click', this._dialogCancelHandler);
    b2.addEventListener('click', this._dialogConfirmHandler);
    this.currentDialog = dialog;
  }

  _removeRestartDialog() {
    if (!this.currentDialog) {
      return;
    }
    const b1 = this.currentDialog.querySelector('[dialog-dismiss]');
    const b2 = this.currentDialog.querySelector('[dialog-confirm]');
    b1.removeEventListener('click', this._dialogCancelHandler);
    b2.removeEventListener('click', this._dialogConfirmHandler);
    document.body.removeChild(this.currentDialog);
    this.currentDialog = undefined;
  }

  _dialogCancelHandler() {
    setTimeout(() => this._removeRestartDialog());
  }

  _dialogConfirmHandler() {
    /* global chrome */
    chrome.runtime.reload();
  }
}
