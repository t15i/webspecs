/** @see https://webidl.spec.whatwg.org/#js-async-iterable */
export type AsyncSequence<T = unknown> = Iterable<T> | AsyncIterable<T>;
