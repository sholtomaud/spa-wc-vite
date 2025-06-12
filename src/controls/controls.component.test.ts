import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APP_CONTROLS_TAG_NAME, AppControlsComponent } from './controls.component';
import store from '../store';

// Mock the store
vi.mock('../store', () => {
  const actualStore = {
    count: 0,
    message: 'Hello',
  };
  const subscribers: ((state: any) => void)[] = [];
  return {
    default: {
      getState: vi.fn(() => actualStore),
      setState: vi.fn((newState) => {
        Object.assign(actualStore, newState);
        subscribers.forEach(s => s(actualStore));
      }),
      subscribe: vi.fn((callback) => {
        subscribers.push(callback);
        callback(actualStore); // Call immediately like the real store
        return () => {
          const index = subscribers.indexOf(callback);
          if (index > -1) subscribers.splice(index, 1);
        };
      }),
      // Helper for tests to reset mock store state and subscribers
      __resetMockStore: () => {
        actualStore.count = 0;
        actualStore.message = 'Hello';
        subscribers.length = 0;
      }
    }
  };
});

describe('AppControlsComponent', () => {
  let component: AppControlsComponent;

  beforeEach(async () => {
    // Reset the mock store before each test
    (store as any).__resetMockStore();

    // Create and append the component to the DOM
    component = document.createElement(APP_CONTROLS_TAG_NAME) as AppControlsComponent;
    document.body.appendChild(component);
    // Wait for component to be fully initialized if it uses async operations in constructor/connectedCallback
    // For this component, it's synchronous.
  });

  afterEach(() => {
    if (component && component.parentNode) {
      component.parentNode.removeChild(component);
    }
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(customElements.get(APP_CONTROLS_TAG_NAME)).toBe(AppControlsComponent);
  });

  it('should increment count in store when increment button is clicked', () => {
    const incrementButton = component.shadowRoot?.querySelector('#increment') as HTMLButtonElement;
    expect(incrementButton).not.toBeNull();

    // Initial state check (optional, as store mock handles it)
    expect(store.getState().count).toBe(0);

    incrementButton.click();

    expect(store.setState).toHaveBeenCalledTimes(1);
    expect(store.setState).toHaveBeenCalledWith({ count: 1 });
    // Verify actual state change in mock store
    expect(store.getState().count).toBe(1);
  });

  it('should decrement count in store when decrement button is clicked', () => {
    // Set initial count to 5 for decrement test
    (store.getState() as any).count = 5;
    // Notify subscribers of this change for completeness, though not strictly needed for this button click test
    (store as any).setState({ count: 5 });
    vi.mocked(store.setState).mockClear(); // Clear previous setState calls

    const decrementButton = component.shadowRoot?.querySelector('#decrement') as HTMLButtonElement;
    expect(decrementButton).not.toBeNull();

    decrementButton.click();

    expect(store.setState).toHaveBeenCalledTimes(1);
    expect(store.setState).toHaveBeenCalledWith({ count: 4 });
    expect(store.getState().count).toBe(4);
  });

  it('should update message in store when typing in message input', () => {
    const messageInput = component.shadowRoot?.querySelector('#message-input') as HTMLInputElement;
    expect(messageInput).not.toBeNull();

    messageInput.value = 'New Message';
    messageInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(store.setState).toHaveBeenCalledTimes(1);
    expect(store.setState).toHaveBeenCalledWith({ message: 'New Message' });
    expect(store.getState().message).toBe('New Message');
  });

  it('should update message input value when store message changes', () => {
    const messageInput = component.shadowRoot?.querySelector('#message-input') as HTMLInputElement;
    expect(messageInput).not.toBeNull();

    // Initial value from store mock
    expect(messageInput.value).toBe('Hello');

    // Simulate external store change
    (store as any).setState({ message: 'Store Updated Message' });

    // Check if the input field reflects the new store state
    expect(messageInput.value).toBe('Store Updated Message');
  });

   it('should initialize message input with current store message', () => {
    // Set a specific message before component initialization for this test
    (store as any).__resetMockStore();
    (store.getState() as any).message = 'Initial Test Message';

    // Re-create component to test initialization
    if (component && component.parentNode) component.parentNode.removeChild(component);
    component = document.createElement(APP_CONTROLS_TAG_NAME) as AppControlsComponent;
    document.body.appendChild(component);

    const messageInput = component.shadowRoot?.querySelector('#message-input') as HTMLInputElement;
    expect(messageInput).not.toBeNull();
    expect(messageInput.value).toBe('Initial Test Message');
  });
});
