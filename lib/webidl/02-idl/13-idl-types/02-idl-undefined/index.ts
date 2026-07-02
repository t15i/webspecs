import type { Type } from "@webidl";

export const UNDEFINED_TYPE_NAME = "undefined";

/** @see https://webidl.spec.whatwg.org/#idl-undefined */
export interface UndefinedType extends Type<undefined> {
  name: typeof UNDEFINED_TYPE_NAME;
}

export function isUndefinedType(T: Type): T is UndefinedType {
  return T.name === UNDEFINED_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [UNDEFINED_TYPE_NAME]: UndefinedType;
  }
}
