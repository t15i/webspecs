import { type Type, type TypeBase, type TypeExtendedAttributes } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#idl-annotated-types */
export interface AnnotatedType<T extends Type = Type> extends TypeBase<
  ReturnType<T>
> {
  extendedAttributes: TypeExtendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#idl-annotated-types */
export function isAnnotatedType(T: Type): T is AnnotatedType {
  return "extendedAttributes" in T;
}
