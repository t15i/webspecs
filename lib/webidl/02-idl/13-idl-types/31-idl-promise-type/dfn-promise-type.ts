import type { Type, TypeBase } from "@webidl";

export const PROMISE_TYPE_NAME = "Promise";

/** @see https://webidl.spec.whatwg.org/#idl-promise */
export interface PromiseType<T extends Type = Type> extends TypeBase<
  Promise<ReturnType<T>>
> {
  name: typeof PROMISE_TYPE_NAME;
  T: T;
}

/** @see https://webidl.spec.whatwg.org/#idl-promise */
export function isPromiseType(T: Type): T is PromiseType {
  return T.name === PROMISE_TYPE_NAME;
}
