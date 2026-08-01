import type { Type, TypeBase } from "@webidl";

export const SEQUENCE_TYPE_NAME = "Sequence";

/** @see https://webidl.spec.whatwg.org/#sequence-type */
export interface SequenceType<T extends Type = Type> extends TypeBase<
  ReturnType<T>[]
> {
  name: typeof SEQUENCE_TYPE_NAME;
  T: T;
}

/** @see https://webidl.spec.whatwg.org/#sequence-type */
export function isSequenceType(T: Type): T is SequenceType {
  return T.name === SEQUENCE_TYPE_NAME;
}
