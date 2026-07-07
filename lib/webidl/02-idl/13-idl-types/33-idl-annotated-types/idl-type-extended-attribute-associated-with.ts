import {
  isAnnotatedType,
  type Type,
  type TypeExtendedAttributes,
} from "@webidl";

export type AnnotatedWithExtAttribute<
  T extends Type,
  K extends keyof TypeExtendedAttributes,
> = T & {
  extendedAttributes: {
    [P in K]-?: NonNullable<TypeExtendedAttributes[P]>;
  };
};

export type AnnotatedWithoutExtAttribute<
  T extends Type,
  K extends keyof TypeExtendedAttributes,
> = T & {
  extendedAttributes: Omit<TypeExtendedAttributes, K>;
};

export function isAnnotatedWithExtAttribute<
  T extends Type,
  K extends keyof TypeExtendedAttributes,
>(type: T | void, key: K): type is AnnotatedWithExtAttribute<T, K> {
  if (typeof type !== "function") {
    return false;
  }
  return isAnnotatedType(type) && key in type.extendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#idl-type-extended-attribute-associated-with */
export function getExtAttributesAssociatedWith(
  type: Type,
): TypeExtendedAttributes {
  return isAnnotatedType(type) ? type.extendedAttributes : {};
}
