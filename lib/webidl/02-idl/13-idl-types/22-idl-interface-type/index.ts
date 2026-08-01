import type { Type, TypeBase } from "@webidl";

export const INTERFACE_TYPE_NAME = "InterfaceType";

/** @see https://webidl.spec.whatwg.org/#idl-interface */
export interface InterfaceType<T = unknown> extends TypeBase<T> {
  name: typeof INTERFACE_TYPE_NAME;
  T: new (...args: unknown[]) => T;
}

/** @see https://webidl.spec.whatwg.org/#idl-interface */
export function isInterfaceType(T: Type): T is InterfaceType {
  return T.name === INTERFACE_TYPE_NAME;
}
