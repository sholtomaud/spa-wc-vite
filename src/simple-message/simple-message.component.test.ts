import { beforeEach, describe, expect, it, afterEach } from 'vitest';
import './simple-message.component'; // Import the component to register it

describe('SimpleMessage Component', () => {
  let component: HTMLElement;

  beforeEach(async () => {
    // Create the component
    component = document.createElement('simple-message');
    document.body.appendChild(component);
    // Wait for the component to be upgraded and rendered if necessary
    // For simple synchronous connectedCallback, this might not be strictly needed,
    // but it's good practice for more complex components.
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('should render the component with a shadow DOM', () => {
    expect(component.shadowRoot).not.toBeNull();
  });

  it('should display the correct message', () => {
    const pElement = component.shadowRoot?.querySelector('p');
    expect(pElement).not.toBeNull();
    expect(pElement?.textContent).toBe('Hello from SimpleMessage component!');
  });

  it('should have basic styling applied', () => {
    const styleElement = component.shadowRoot?.querySelector('style');
    expect(styleElement).not.toBeNull();
    expect(styleElement?.textContent).toContain('display: block;');
    expect(styleElement?.textContent).toContain('padding: 16px;');
    expect(styleElement?.textContent).toContain('border: 1px solid #ccc;');
    expect(styleElement?.textContent).toContain('border-radius: 4px;');
  });

  afterEach(() => {
    if (component && component.parentNode) {
      component.parentNode.removeChild(component);
    }
  });
});
