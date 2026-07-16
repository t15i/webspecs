import {
  isAnnotatedType,
  type Type,
  type TypeExtendedAttributes,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#idl-type-extended-attribute-associated-with */
export function getExtAttributesAssociatedWith(
  type: Type,
): TypeExtendedAttributes {
  return isAnnotatedType(type) ? type.extendedAttributes : {};
}
