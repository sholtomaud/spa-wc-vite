import { describe, it, expect, vi } from 'vitest';
import store from './store'; // Assuming default store export

// Helper to get a clean store instance for each test if needed,
// or reset the existing default store. For this example, we'll reset the default store.
const resetStore = () => {
  store.setState({ count: 0, message: 'Hello' });
  // If subscribers array is not cleared by setState, manually clear it.
  // This depends on the Store implementation. For the current one, setState doesn't clear subscribers.
  // We need a way to clear subscribers for test isolation, or use new instances.
  // For simplicity, let's assume we can add a reset method to the store or test it as is,
  // being mindful of shared state across tests if not handled.
  // A better approach for testability would be to export the class and instantiate it.
  // Let's try to get a fresh store for some tests if possible or manage state carefully.
};

// For the purpose of these tests, and given the current store.ts exports a singleton instance,
// we will manage its state. A better practice would be to export the Store class
// and instantiate it in tests: `new Store({ count: 0, message: 'Hello' })`.
// However, I will proceed with the current structure.

describe('Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    // This is tricky with singletons. A 'resetSubscribers' method or new instances would be better.
    // For now, we'll reset state and be aware that subscribers might persist if not unsubscribed.
    store.setState({ count: 0, message: 'Hello' });
    // Manually clear subscribers for test isolation (dirty hack for singleton store)
    (store as any).subscribers = [];
  });

  it('should have correct initial state', () => {
    expect(store.getState()).toEqual({ count: 0, message: 'Hello' });
  });

  describe('setState', () => {
    it('should update state correctly', () => {
      store.setState({ count: 5 });
      expect(store.getState().count).toBe(5);
      expect(store.getState().message).toBe('Hello'); // Message should remain unchanged

      store.setState({ message: 'World' });
      expect(store.getState().message).toBe('World');
      expect(store.getState().count).toBe(5); // Count should remain unchanged

      store.setState({ count: 10, message: 'Test' });
      expect(store.getState()).toEqual({ count: 10, message: 'Test' });
    });

    it('should notify subscribers with the new state', () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      store.subscribe(subscriber1);
      store.subscribe(subscriber2);

      // Clear initial calls from subscribe()
      subscriber1.mockClear();
      subscriber2.mockClear();

      store.setState({ count: 1 });

      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber1).toHaveBeenCalledWith({ count: 1, message: 'Hello' });

      expect(subscriber2).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledWith({ count: 1, message: 'Hello' });

      store.setState({ message: 'New Message' });
      expect(subscriber1).toHaveBeenCalledTimes(2); // Called again
      expect(subscriber1).toHaveBeenCalledWith({ count: 1, message: 'New Message' });
    });
  });

  describe('subscribe', () => {
    it('should call the subscriber immediately with the current state', () => {
      const subscriber = vi.fn();
      store.subscribe(subscriber);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith({ count: 0, message: 'Hello' });
    });

    it('should call subscribers on state change', () => {
      const subscriber = vi.fn();
      store.subscribe(subscriber);
      subscriber.mockClear(); // Clear initial call

      store.setState({ count: 7 });
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith({ count: 7, message: 'Hello' });
    });

    it('should allow unsubscribing', () => {
      const subscriber = vi.fn();
      const unsubscribe = store.subscribe(subscriber);
      subscriber.mockClear(); // Clear initial call

      unsubscribe();

      store.setState({ count: 100 });
      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not affect other subscribers when one unsubscribes', () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      const unsubscribe1 = store.subscribe(subscriber1);
      store.subscribe(subscriber2);

      subscriber1.mockClear();
      subscriber2.mockClear();

      unsubscribe1();
      store.setState({ count: 99 });

      expect(subscriber1).not.toHaveBeenCalled();
      expect(subscriber2).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledWith({ count: 99, message: 'Hello' });
    });
  });
});
