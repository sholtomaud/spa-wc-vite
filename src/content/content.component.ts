import html from './content.component.html?inline';
import css from './content.component.css?inline';
import store from '../store';

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;

export const APP_CONTENT_TAG_NAME = 'app-content';

export class AppContentComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    // Subscribe to store changes and update display
    store.subscribe(state => {
      this.updateCountDisplay(state.count);
      this.updateMessageDisplay(state.message);
    });

    // Initialize display with initial store values
    const initialState = store.getState();
    this.updateCountDisplay(initialState.count);
    this.updateMessageDisplay(initialState.message);
  }

  private updateCountDisplay(count: number): void {
    this.shadowRoot!.querySelector('.number')!.textContent = ` ${count}`;
  }

  private updateMessageDisplay(message: string): void {
    this.shadowRoot!.querySelector('.message')!.textContent = ` ${message}`;
  }
}

customElements.define(APP_CONTENT_TAG_NAME, AppContentComponent);
