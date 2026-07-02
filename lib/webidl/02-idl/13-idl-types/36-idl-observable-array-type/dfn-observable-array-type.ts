import type { Type } from "@webidl";

export const OBSERVABLE_ARRAY_TYPE_NAME = "ObservableArray";

/** @see https://webidl.spec.whatwg.org/#dfn-observable-array-type */
export interface ObservableArrayType<T extends Type = Type> extends Type<
  ReturnType<T>[]
> {
  name: typeof OBSERVABLE_ARRAY_TYPE_NAME;
  T: T;
}

export function isObservableArrayType(T: Type): T is ObservableArrayType {
  return T.name === OBSERVABLE_ARRAY_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [OBSERVABLE_ARRAY_TYPE_NAME]: ObservableArrayType;
  }
}
