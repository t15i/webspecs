import type { Type } from "@webidl";

export const SEQUENCE_TYPE_NAME = "Sequence";

/** @see https://webidl.spec.whatwg.org/#sequence-type */
export interface SequenceType<T extends Type = Type> extends Type<
  ReturnType<T>[]
> {
  name: typeof SEQUENCE_TYPE_NAME;
  T: T;
}

export function isSequenceType(T: Type): T is SequenceType {
  return T.name === SEQUENCE_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [SEQUENCE_TYPE_NAME]: SequenceType;
  }
}
