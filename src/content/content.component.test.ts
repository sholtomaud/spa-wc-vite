import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APP_CONTENT_TAG_NAME, AppContentComponent } from './content.component';
import store from '../store';

// Mock the store (similar to controls.component.test.ts)
vi.mock('../store', () => {
  const actualStore = {
    count: 0,
    message: 'Hello Vitest', // Using a distinct initial message for clarity
  };
  const subscribers: ((state: any) => void)[] = [];
  return {
    default: {
      getState: vi.fn(() => actualStore),
      setState: vi.fn((newState) => { // Though AppContent doesn't call setState
        Object.assign(actualStore, newState);
        subscribers.forEach(s => s(actualStore));
      }),
      subscribe: vi.fn((callback) => {
        subscribers.push(callback);
        callback(actualStore); // Call immediately
        return () => {
          const index = subscribers.indexOf(callback);
          if (index > -1) subscribers.splice(index, 1);
        };
      }),
      // Helper for tests to reset mock store state and subscribers
      __resetMockStore: (initialState = { count: 0, message: 'Hello Vitest' }) => {
        actualStore.count = initialState.count;
        actualStore.message = initialState.message;
        subscribers.length = 0;
      },
      __triggerSubscribers: () => { // Helper to simulate external store update
         subscribers.forEach(s => s(actualStore));
      }
    }
  };
});

describe('AppContentComponent', () => {
  let component: AppContentComponent;

  beforeEach(async () => {
    // Reset the mock store before each test
    (store as any).__resetMockStore();

    // Create and append the component to the DOM
    component = document.createElement(APP_CONTENT_TAG_NAME) as AppContentComponent;
    document.body.appendChild(component);
    // Wait for component to be fully initialized
  });

  afterEach(() => {
    if (component && component.parentNode) {
      component.parentNode.removeChild(component);
    }
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(customElements.get(APP_CONTENT_TAG_NAME)).toBe(AppContentComponent);
  });

  it('should display initial count and message from the store', () => {
    const countElement = component.shadowRoot?.querySelector('.number');
    const messageElement = component.shadowRoot?.querySelector('.message');

    expect(countElement).not.toBeNull();
    expect(messageElement).not.toBeNull();

    expect(countElement!.textContent?.trim()).toBe(store.getState().count.toString());
    expect(messageElement!.textContent?.trim()).toBe(store.getState().message);
  });

  it('should update count display when count in store changes', async () => {
    const countElement = component.shadowRoot?.querySelector('.number');
    expect(countElement).not.toBeNull();

    // Simulate store change
    (store.getState() as any).count = 123;
    (store as any).__triggerSubscribers(); // Manually trigger subscribers with new state

    // Allow for microtask queue to flush if updates are async (though current setup is sync)
    await Promise.resolve();

    expect(countElement!.textContent?.trim()).toBe('123');
  });

  it('should update message display when message in store changes', async () => {
    const messageElement = component.shadowRoot?.querySelector('.message');
    expect(messageElement).not.toBeNull();

    // Simulate store change
    (store.getState() as any).message = 'Updated Message from Store';
    (store as any).__triggerSubscribers();

    await Promise.resolve();

    expect(messageElement!.textContent?.trim()).toBe('Updated Message from Store');
  });

  it('should display different initial values if store is initialized differently', () => {
    // Reset store with specific initial values for this test
    (store as any).__resetMockStore({ count: 99, message: 'Specific Test' });

    // Re-create component to test initialization with new store state
    if (component && component.parentNode) component.parentNode.removeChild(component);
    component = document.createElement(APP_CONTENT_TAG_NAME) as AppContentComponent;
    document.body.appendChild(component);

    const countElement = component.shadowRoot?.querySelector('.number');
    const messageElement = component.shadowRoot?.querySelector('.message');

    expect(countElement!.textContent?.trim()).toBe('99');
    expect(messageElement!.textContent?.trim()).toBe('Specific Test');
  });
});
