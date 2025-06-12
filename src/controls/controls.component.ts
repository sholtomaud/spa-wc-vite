import html from './controls.component.html?inline';
import css from './controls.component.css?inline';
import store from '../store';

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;

/**
 * The tag name for the app-controls custom element.
 * @type {string}
 */
export const APP_CONTROLS_TAG_NAME = 'app-controls';

/**
 * Represents the controls component that allows interaction with the store.
 * @extends {HTMLElement}
 */
export class AppControlsComponent extends HTMLElement {
  /**
   * Creates an instance of AppControlsComponent.
   * Sets up event listeners for buttons and input fields to modify the store state.
   * Subscribes to store changes to update the input field.
   */
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
