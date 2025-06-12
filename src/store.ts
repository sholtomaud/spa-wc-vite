interface State {
  count: number;
  message: string;
}

type Subscriber<T> = (state: T) => void;

/**
 * Represents a generic store for managing application state.
 * @template T - The type of the state managed by the store.
 */
class Store<T> {
  private state: T;
  private subscribers: Subscriber<T>[] = [];

  /**
   * Creates an instance of the Store.
   * @param {T} initialState - The initial state of the store.
   */
  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * Gets the current state.
   * @returns {T} The current state.
   */
  getState(): T {
    return this.state;
  }

  /**
   * Sets a new state by merging the partial new state with the current state.
   * Notifies all subscribers after the state is updated.
   * @param {Partial<T>} newState - The partial new state to merge.
   */
  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  /**
   * Subscribes a callback function to state changes.
   * The callback is immediately invoked with the current state upon subscription.
   * @param {Subscriber<T>} callback - The function to call when the state changes.
   * @returns {() => void} A function to unsubscribe the callback.
   */
  subscribe(callback: Subscriber<T>): () => void {
    this.subscribers.push(callback);
    // Notify the new subscriber with the current state
    callback(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.state));
  }
}

// Initialize the store with a default state
const store = new Store<State>({ count: 0, message: 'Hello' });

export default store;
