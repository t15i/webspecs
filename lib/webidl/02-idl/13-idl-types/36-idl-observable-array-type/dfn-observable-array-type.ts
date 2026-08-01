import type { Type, TypeBase } from "@webidl";

export const OBSERVABLE_ARRAY_TYPE_NAME = "ObservableArray";

/** @see https://webidl.spec.whatwg.org/#dfn-observable-array-type */
export interface ObservableArrayType<T extends Type = Type> extends TypeBase<
  ReturnType<T>[]
> {
  name: typeof OBSERVABLE_ARRAY_TYPE_NAME;
  T: T;
}

/** @see https://webidl.spec.whatwg.org/#dfn-observable-array-type */
export function isObservableArrayType(T: Type): T is ObservableArrayType {
  return T.name === OBSERVABLE_ARRAY_TYPE_NAME;
}
