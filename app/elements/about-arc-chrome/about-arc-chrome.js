class AboutArcChrome extends Polymer.Element {
  static get is() {
    return 'about-arc-chrome';
  }
  static get properties() {
    return {
      appVersion: String
    };
  }

  showLicensing() {
    this.dispatchEvent(new CustomEvent('display-license', {
      bubbles: true,
      composed: true
    }));
  }
}
window.customElements.define(AboutArcChrome.is, AboutArcChrome);
