/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iterator-records */
export interface IteratorRecord {
  iterator: object;
  nextMethod: unknown;
  done: boolean;
}
