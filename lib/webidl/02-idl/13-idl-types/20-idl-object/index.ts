import type { Type, TypeBase } from "@webidl";

export const OBJECT_TYPE_NAME = "object";

/** @see https://webidl.spec.whatwg.org/#idl-object */
export interface ObjectType extends TypeBase<object> {
  name: typeof OBJECT_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-object */
export function isObjectType(T: Type): T is ObjectType {
  return T.name === OBJECT_TYPE_NAME;
}
