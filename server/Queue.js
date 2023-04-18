class Queue {
  constructor() {
    this._queue = [];
    this._size = 0;
    this._front = 0;
  }

  get size() {
    return this._size;
  }

  enqueue(item) {
    this._queue.push(item);
    this._size++;
  }

  dequeue() {
    if (this._size === 0) {
      return undefined;
    }
    const item = this._queue[this._front];
    this._queue[this._front] = undefined;
    this._front++;
    this._size--;
    if (this._size === 0) {
      this._front = 0;
    }
    return item;
  }

  peek() {
    if (this._size === 0) {
      return undefined;
    }
    return this._queue[this._front];
  }
}

module.exports = Queue;
