class BlockingQueue {
  constructor() {
    this._queue = [];
    this._size = 0;
    this._front = 0;
    this._waiting = [];
  }

  view() {
    return this._waiting;
  }
  get size() {
    return this._size;
  }

  enqueue(item) {
    this._queue.push(item);
    this._size++;
    if (this._waiting.length > 0) {
      const resolve = this._waiting.shift();
      resolve(item);
    }
  }

  dequeue() {
    if (this._size === 0) {
      return new Promise((resolve) => {
        this._waiting.push(resolve);
      });
    }
    const item = this._queue[this._front];
    this._queue[this._front] = undefined;
    this._front++;
    this._size--;
    if (this._size === 0) {
      this._front = 0;
    }
    return Promise.resolve(item);
  }

  peek() {
    if (this._size === 0) {
      return undefined;
    }
    return this._queue[this._front];
  }
}

module.exports = BlockingQueue;
