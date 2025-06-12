import html from './page-two.component.html?inline';

const template = document.createElement('template');
template.innerHTML = `${html}`;

/**
 * The tag name for the app-page-two custom element.
 * @type {string}
 */
export const APP_PAGE_TWO_TAG_NAME = 'app-page-two';

/**
 * Represents the Page Two component.
 * It reads a 'number' query parameter and passes it to an app-content component.
 * @extends {HTMLElement}
 */
export class AppPageTwoComponent extends HTMLElement {
  /**
   * Creates an instance of AppPageTwoComponent.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  /**
   * Lifecycle callback invoked when the element is connected to the DOM.
   * Reads the 'number' query parameter from the URL and sets it as an attribute
   * on an 'app-content' element within its shadow DOM.
   */
  connectedCallback() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const number = urlParams.get('number');
    if (number) {
      this.shadowRoot?.querySelector('app-content')?.setAttribute('number', number);
    }
  }
}
