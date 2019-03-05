/**
 * Main component for ARC electron app.
 *
 * @appliesMixin ArcComponents.ArcAppMixin
 */
class ArcChrome extends ArcComponents.ArcAppMixin(Polymer.Element) {
  static get is() {
    return 'arc-chrome';
  }

  initApplication() {
    console.log('App initialized');
  }
}

window.customElements.define('arc-chrome', ArcChrome);
