import type { AsyncSequence, Type, TypeBase } from "@webidl";

export const ASYNC_SEQUENCE_TYPE_NAME = "AsyncSequence";

/** @see https://webidl.spec.whatwg.org/#idl-async-iterable */
export interface AsyncSequenceType<T extends Type = Type> extends TypeBase<
  AsyncSequence<ReturnType<T>>
> {
  name: typeof ASYNC_SEQUENCE_TYPE_NAME;
  T: T;
}

/** @see https://webidl.spec.whatwg.org/#idl-async-iterable */
export function isAsyncSequenceType(T: Type): T is AsyncSequenceType {
  return T.name === ASYNC_SEQUENCE_TYPE_NAME;
}
