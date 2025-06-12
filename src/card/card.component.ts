import html from './card.component.html?inline';
import css from './card.component.scss?inline';

const template = document.createElement('template');
template.innerHTML = `<style>${css}</style>${html}`;

/**
 * The tag name for the app-card custom element.
 * @type {string}
 */
export const APP_CARD_TAG_NAME = 'app-card';

/**
 * Represents a card component.
 * @extends {HTMLElement}
 */
export class AppCardComponent extends HTMLElement {
  /**
   * Creates an instance of AppCardComponent.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.appendChild(template.content.cloneNode(true));
  }
}
