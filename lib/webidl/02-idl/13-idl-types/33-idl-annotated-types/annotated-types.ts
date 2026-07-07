import { type Type, type TypeExtendedAttributes } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#idl-annotated-types */
export interface AnnotatedType<T extends Type = Type> extends Type<
  ReturnType<T>
> {
  extendedAttributes: TypeExtendedAttributes;
}

export function isAnnotatedType(T: Type): T is AnnotatedType {
  return "extendedAttributes" in T;
}
