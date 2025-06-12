class SimpleMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
        </style>
        <p>Hello from SimpleMessage component!</p>
      `;
    }
  }
}

customElements.define('simple-message', SimpleMessage);
