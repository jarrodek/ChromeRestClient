/**
 * `install-proxy-dialog`
 *
 * ## Styling
 *
 * `<install-proxy-dialog>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--install-proxy-dialog` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
class InstallProxyDialog extends Polymer.mixinBehaviors([Polymer.PaperDialogBehavior], Polymer.Element) {
  static get is() {
    return 'install-proxy-dialog';
  }
  static get properties() {
    return {
      // Chrome WebStore extension base URL
      webstoreUrl: {
        type: String,
        value: 'https://chrome.google.com/webstore/detail/'
      },
      // Cookie extension ID
      extensionId: {
        type: String,
        value: function() {
          return 'apcedakaoficjlofohhcmkkljehnmebp';
        }
      },
      // Computed value, the extensoin URL.
      extensionUrl: {
        type: String,
        computed: '_computeUrl(webstoreUrl, extensionId)'
      }
    };
  }

  // Computes the full URL value to the extension page.
  _computeUrl(webstoreUrl, extensionId) {
    if (webstoreUrl[webstoreUrl.length - 1] !== '/') {
      webstoreUrl += '/';
    }
    return webstoreUrl + extensionId;
  }

  // Handler for button tap.
  _buttonTap() {
    this.dispatchEvent(new CustomEvent('send-analytics', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'event',
        category: 'Secondary action',
        action: 'Action button tap',
        label: 'Install proxy dialog'
      }
    }));
  }
}
window.customElements.define(InstallProxyDialog.is, InstallProxyDialog);
