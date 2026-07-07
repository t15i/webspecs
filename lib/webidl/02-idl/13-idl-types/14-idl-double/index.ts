import type { Type } from "@webidl";

export const DOUBLE_TYPE_NAME = "double";

/** @see https://webidl.spec.whatwg.org/#idl-double */
export interface DoubleType extends Type<number> {
  name: typeof DOUBLE_TYPE_NAME;
}

export function isDoubleType(T: Type): T is DoubleType {
  return T.name === DOUBLE_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [DOUBLE_TYPE_NAME]: DoubleType;
  }
}
