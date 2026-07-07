import type { AsyncSequence, Type } from "@webidl";

export const ASYNC_SEQUENCE_TYPE_NAME = "AsyncSequence";

/** @see https://webidl.spec.whatwg.org/#idl-async-iterable */
export interface AsyncSequenceType<T extends Type = Type> extends Type<
  AsyncSequence<ReturnType<T>>
> {
  name: typeof ASYNC_SEQUENCE_TYPE_NAME;
  T: T;
}

export function isAsyncSequenceType(T: Type): T is AsyncSequenceType {
  return T.name === ASYNC_SEQUENCE_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [ASYNC_SEQUENCE_TYPE_NAME]: AsyncSequenceType;
  }
}
