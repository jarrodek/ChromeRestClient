/**
 * `arc-chrome-experiment-settings`
 *
 * Experiments settings panel for ARC
 *
 * ## Styling
 *
 * `<arc-chrome-experiment-settings>` provides the following custom
 * properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--arc-request-settings-panel` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcComponents.ArcSettingsPanelMixin
 */
class ArcElectronExperimentSettings extends ArcComponents.ArcSettingsPanelMixin(Polymer.Element) {
  /* global ArcComponents */
  static get is() {
    return 'arc-chrome-experiment-settings';
  }
  static get properties() {
    return {
      /**
       * Collects information abour system variables when evaluating
       * request.
       */
      popupMenuExperimentEnabled: {
        type: Boolean,
        notify: true,
        observer: '_popupMenuChanged'
      },
      /**
       * Enables requests/projects drag and drop between different views.
       */
      draggableEnabled: {
        type: Boolean,
        notify: true,
        observer: '_draggableChanged'
      }
    };
  }

  _popupMenuChanged(value) {
    this.updateSetting('popupMenuExperimentEnabled', value);
  }

  _draggableChanged(value) {
    this.updateSetting('draggableEnabled', value);
  }

  _processValues(values) {
    if (typeof values.popupMenuExperimentEnabled === 'undefined') {
      values.popupMenuExperimentEnabled = false;
    } else {
      values.popupMenuExperimentEnabled = this._boolValue(values.popupMenuExperimentEnabled);
    }
    if (typeof values.draggableEnabled === 'undefined') {
      values.draggableEnabled = false;
    } else {
      values.draggableEnabled = this._boolValue(values.draggableEnabled);
    }
    return values;
  }

  _setSettings(values) {
    this.__settingsRestored = false;
    this.popupMenuExperimentEnabled = values.popupMenuExperimentEnabled;
    this.draggableEnabled = values.draggableEnabled;
    this.__settingsRestored = true;
  }

  _settingsChanged(key, value) {
    this.__settingsRestored = false;
    switch (key) {
      case 'popupMenuExperimentEnabled':
      case 'draggableEnabled':
        this[key] = value;
        break;
    }
    this.__settingsRestored = true;
  }
}
window.customElements.define(ArcElectronExperimentSettings.is, ArcElectronExperimentSettings);
