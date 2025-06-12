import html from './controls.component.html?inline';
import css from './controls.component.css?inline';
import store from '../store';

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;

export const APP_CONTROLS_TAG_NAME = 'app-controls';

export class AppControlsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const incrementButton = this.shadowRoot?.querySelector('#increment');
    const decrementButton = this.shadowRoot?.querySelector('#decrement');
    const messageInput = this.shadowRoot?.querySelector('#message-input') as HTMLInputElement;

    incrementButton?.addEventListener('click', () => {
      const currentCount = store.getState().count;
      store.setState({ count: currentCount + 1 });
    });

    decrementButton?.addEventListener('click', () => {
      const currentCount = store.getState().count;
      store.setState({ count: currentCount - 1 });
    });

    messageInput?.addEventListener('input', (event) => {
      store.setState({ message: (event.target as HTMLInputElement).value });
    });

    // Subscribe to store changes for message
    store.subscribe(state => {
      if (messageInput && messageInput.value !== state.message) {
        messageInput.value = state.message;
      }
    });

    // Initialize input with store message
    if (messageInput) {
      messageInput.value = store.getState().message;
    }
  }
}

customElements.define(APP_CONTROLS_TAG_NAME, AppControlsComponent);
