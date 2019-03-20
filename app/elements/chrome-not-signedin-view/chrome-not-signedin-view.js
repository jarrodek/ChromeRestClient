class ChromeNotSignedinView extends Polymer.Element {
  static get template() {
    return Polymer.html`<style>
    :host {
      display: block;
      background: var(--paper-dialog-background-color, --primary-background-color);
      color: var(--paper-dialog-color, --primary-text-color);
      @apply --paper-font-body1;
    }

    :host>* {
      padding: 0 24px;
    }

    h2 {
      position: relative;
      margin: 0;
      @apply --paper-font-title;
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .buttons {
      position: relative;
      padding: 8px 8px 8px 24px;
      margin: 0 0 24px;
      color: var(--paper-dialog-button-color, --primary-color);
      @apply --layout-horizontal;
      @apply --layout-end-justified;
    }
    </style>

    <paper-dialog opened="{{opened}}">
      <h2>Not signed in to Chrome</h2>
      <paper-dialog-scrollable>
        <error-message>
          <p>Sign in to Chrome before calling this acction</p>
          <p>Before you can authorize the application with Googole you must be
          signed in to Chrome. After set up, try again.</p>
        </error-message>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-dismiss on-click="_learnMore">Learn more</paper-button>
        <paper-button dialog-dismiss>Close</paper-button>
      </div>
    </paper-dialog>`;
  }

  static get properties() {
    return {
      opened: Boolean
    };
  }

  _learnMore() {
    window.open('https://github.com/jarrodek/ChromeRestClient/wiki/faq#signing-in-and-permissions');
  }
}
window.customElements.define('chrome-not-signedin-view', ChromeNotSignedinView);
