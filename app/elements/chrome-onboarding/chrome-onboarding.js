/**
 * `onboarding-page`
 *
 * ## Styling
 *
 * `<onboarding-page>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--onboarding-page` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
class ChromeOnboarding extends Polymer.Element {
  static get is() {
    return 'chrome-onboarding';
  }
  static get properties() {
    return {
      // True if the tutorial is being rendered.
      opened: Boolean,
      /**
       * Number of miliseconds to upen the tutorial.
       */
      delay: Number
    };
  }

  _followLink(e) {
    if (e.target.dataset.href) {
      return window.open(e.target.dataset.href);
    }
  }
}
window.customElements.define('chrome-onboarding', ChromeOnboarding);
