interface State {
  count: number;
  message: string;
}

type Subscriber<T> = (state: T) => void;

class Store<T> {
  private state: T;
  private subscribers: Subscriber<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

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
