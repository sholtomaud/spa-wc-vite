import html from './page-one.component.html?inline';

const template = document.createElement('template');
template.innerHTML = `${html}`;

/**
 * The tag name for the app-page-one custom element.
 * @type {string}
 */
export const APP_PAGE_ONE_TAG_NAME = 'app-page-one';

/**
 * Represents the Page One component.
 * @extends {HTMLElement}
 */
export class AppPageOneComponent extends HTMLElement {
  /**
   * Creates an instance of AppPageOneComponent.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  /**
   * Lifecycle callback invoked when the element is connected to the DOM.
   * Sets up router links within the component's shadow DOM.
   */
  connectedCallback() {
    // @ts-ignore
    window.routerLinkSetup(this.shadowRoot);
  }
}
