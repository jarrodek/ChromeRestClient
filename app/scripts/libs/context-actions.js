/**
 * A class responsible to render and handle actions related to context menu.
 */
export class ArcContextMenu {
  /**
   * @constructor
   */
  constructor() {
    this.contextActions = [];
    this._contextMenuHandler = this._contextMenuHandler.bind(this);
    this._selectionHandler = this._selectionHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
  }
  /**
   * Reference to the main application window.
   *
   * @return {HtmlElement}
   */
  get app() {
    return document.getElementById('app');
  }
  /**
   * Listens for body events.
   */
  observe() {
    document.body.addEventListener('contextmenu', this._contextMenuHandler);
    document.body.addEventListener('click', this._clickHandler);
  }

  registerDefaultActions() {
    console.info('Registering window default context menu actions');
    this._addCloseTab();
    this._addCloseAllTabs();
    this._addCloseOtherTabs();
    this._addDuplicateTab();
  }

  /**
   * Adds default action to close request workspace tab.
   */
  _addCloseTab() {
    this.addAction({
      label: 'Close tab',
      selector: 'paper-tab > span.tab-name',
      action: 'request-panel-close-tab'
    });
  }
  /**
   * Adds default action to close all request workspace tab.
   */
  _addCloseAllTabs() {
    this.addAction({
      label: 'Close all tabs',
      selector: 'paper-tab > span.tab-name',
      action: 'request-panel-close-all-tabs'
    });
  }
  /**
   * Adds default action to close all request workspace tab.
   */
  _addCloseOtherTabs() {
    this.addAction({
      label: 'Close other tabs',
      selector: 'paper-tab > span.tab-name',
      action: 'request-panel-close-other-tabs'
    });
  }

  /**
   * Adds default action to close all request workspace tab.
   */
  _addDuplicateTab() {
    this.addAction({
      label: 'Duplicate tab',
      selector: 'paper-tab > span.tab-name',
      action: 'request-panel-duplicate-tab'
    });
  }
  /**
   * Registers an action.
   * @param {Object} action Description of the action. Each action has to contain
   * the following propertues:
   * - `label` String, laber to render in the context menu.
   * - `selector` String, CSS selector to match the action.
   * - `action` String Action name. If the module that adds the action is main
   * process mo0dule it must prefix the action with `'main:`, then listen for
   * `context-action:[action-name]` on the ipcMain. If the module works in the
   * renderer process then it must prefix the action with `renderer:`, then
   * handle a CustomEvent on the window object that is of a type of `context-action:[action-name]`.
   * No additional arguments are provided for the event.
   * @throws {Error} An error when the argument is invalid.
   */
  addAction(action) {
    if (!this._valid(action)) {
      throw new Error('The context menu action is Not valid.');
    }
    this.contextActions.push(action);
  }
  /**
   * Removes previously registered action.
   * @param {String|Object} action An action object used to register an action
   * or action's action property value.
   * @return {Boolean} True if the action has been removed.
   * @throws {Error} An error when the argument is invalid.
   */
  removeAction(action) {
    if (!action) {
      throw new Error('The "action" argument is required');
    }
    if (typeof action !== 'string') {
      if (!this._valid(action)) {
        throw new Error('The "action" argument is invalid');
      }
      action = action.action;
    }
    const index = this.contextActions.findIndex((i) => i.action === action);
    if (index === -1) {
      console.warn('Context menu action ' + action + ' is not registered.');
      return false;
    }
    this.contextActions.splice(index, 1);
    return true;
  }
  /**
   * Tests if passed action is a valid context action.
   *
   * @param {Object} action
   * @return {Boolean}
   */
  _valid(action) {
    if (!action || !action.label || !action.selector || !action.action) {
      return false;
    }
    return true;
  }
  /**
   * A handler for `contextmenu` event dispatched when the user right click on
   * an element.
   * If the target element matches any selector of registered actions it will
   * be added to the list of results to dropdown menu.
   *
   * @param {MouseEvent} e
   */
  _contextMenuHandler(e) {
    this.removeActions();
    const target = e.composedPath()[0];
    if (!target) {
      return;
    }
    const actions = [];
    for (let i = 0, len = this.contextActions.length; i < len; i++) {
      const data = this.contextActions[i];
      if (target.matches(data.selector)) {
        actions.push(data);
      }
    }
    if (actions.length) {
      this._lastTarget = target;
      const {x, y} = e;
      this.renderActions(actions, {x, y});
    }
  }
  /**
   * Unregisters context action.
   *
   * @param {EventEmitter} e
   * @param {Object} action
   */
  _unregisterContextAction(e, action) {
    this.removeAction(action);
  }
  /**
   * Renders context menu actions.
   *
   * @param {Array<Object>} actions List of actions to render
   * @param {Object} xy An object with `x` and `y` coordinates of click.
   */
  renderActions(actions, xy) {
    this.removeActions();
    const box = document.createElement('paper-listbox');
    box.addEventListener('selected-changed', this._selectionHandler);
    actions.forEach((action) => {
      const item = document.createElement('paper-item');
      item.innerText = action.label;
      item.dataset.action = action.action;
      box.appendChild(item);
    });
    this._currentMenu = box;
    this._currentActions = actions;
    box.className = 'arc-context-menu';
    box.style.top = xy.y + 'px';
    box.style.left = xy.x + 'px';
    document.body.appendChild(box);
  }
  /**
   * Removes context menu view from the document.
   */
  removeActions() {
    if (!this._currentMenu) {
      return;
    }
    this._currentMenu.removeEventListener('selected-changed',
      this._selectionHandler);
    document.body.removeChild(this._currentMenu);
    this._currentMenu = undefined;
    this._currentActions = undefined;
  }
  /**
   * Handler for menu selection.
   *
   * @param {CustomEvent} e
   */
  _selectionHandler(e) {
    const action = this._currentActions[e.detail.value];
    this.removeActions();
    if (!action) {
      this._lastTarget = undefined;
      return;
    }
    this._handleAction(action);
  }
  /**
   * Handles application default actions when calling main process is not
   * needed.
   *
   * @param {Object} action Action definition
   */
  _handleAction(action) {
    switch (action.action) {
      case 'request-panel-close-tab':
        this.app.closeWorkspaceTab(this._getTabClickIndex());
        break;
      case 'request-panel-close-all-tabs':
        this.app.closeAllWorkspaceTabs();
        break;
      case 'request-panel-close-other-tabs':
        this.app.closeOtherWorkspaceTabs(this._getTabClickIndex());
        break;
      case 'request-panel-duplicate-tab':
        this.app.duplicateWorkspaceTab(this._getTabClickIndex());
        break;
      default:
        console.log('Handle action', action);
        // this._dispatchRendererAction(action.action);
        break;
    }
  }

  /**
   * Dispatches web custom event with type as a comination of `context-action:`
   * and `action`. Module that requested the action should listen on the
   * window object for the event.
   * @param {String} action Registered action name.
   */
  _dispatchRendererAction(action) {
    const eventNamed = 'context-action:' + action;
    document.body.dispatchEvent(new CustomEvent(eventNamed, {
      bubbles: true,
      cancelable: true
    }));
  }

  /**
   * Gets an index of the tab which is the source of one of the pre-build actions.
   * @return {Number} An index of the tab
   */
  _getTabClickIndex() {
    const tab = this._lastTarget.parentElement;
    return Array.from(tab.parentElement.children).indexOf(tab);
  }
  /**
   * Closes menu action.
   *
   * @param {MouseEvent} e
   */
  _clickHandler(e) {
    if (!this._currentMenu) {
      return;
    }
    const path = e.composedPath();
    const inside = path.some((item) => item === this._currentMenu);
    if (!inside) {
      this.removeActions();
      this._lastTarget = undefined;
    }
  }
}
