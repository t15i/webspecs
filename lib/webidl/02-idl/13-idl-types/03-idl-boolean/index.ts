import type { Type } from "@webidl";

export const BOOLEAN_TYPE_NAME = "boolean";

/** @see https://webidl.spec.whatwg.org/#idl-boolean */
export interface BooleanType extends Type<boolean> {
  name: typeof BOOLEAN_TYPE_NAME;
}

export function isBooleanType(T: Type): T is BooleanType {
  return T.name === BOOLEAN_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [BOOLEAN_TYPE_NAME]: BooleanType;
  }
}
