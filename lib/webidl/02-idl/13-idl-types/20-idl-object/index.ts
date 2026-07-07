import type { Type } from "@webidl";

export const OBJECT_TYPE_NAME = "object";

/** @see https://webidl.spec.whatwg.org/#idl-object */
export interface ObjectType extends Type<object> {
  name: typeof OBJECT_TYPE_NAME;
}

export function isObjectType(T: Type): T is ObjectType {
  return T.name === OBJECT_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [OBJECT_TYPE_NAME]: ObjectType;
  }
}
