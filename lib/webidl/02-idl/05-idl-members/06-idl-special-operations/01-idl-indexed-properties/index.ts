import {
  isAttribute,
  isIntegerType,
  type Interface,
  type Type,
  type UnsignedLongType,
  type SpecialOperation,
} from "@webidl";

export * from "./dfn-determine-the-value-of-an-indexed-property";
export * from "./dfn-set-the-value-of-a-new-indexed-property";
export * from "./dfn-set-the-value-of-an-existing-indexed-property";
export * from "./dfn-support-indexed-properties";
export * from "./dfn-supported-property-indices";

/** @see https://webidl.spec.whatwg.org/#idl-indexed-properties */
export type IndexedPropertyGetterOperation<T extends Type = Type> =
  SpecialOperation<[UnsignedLongType], T>;

/** @see https://webidl.spec.whatwg.org/#idl-indexed-properties */
export type IndexedPropertySetterOperation<
  T extends Type = Type,
  Return extends Type = Type,
> = SpecialOperation<[UnsignedLongType, T], Return>;

/**
 * § 2.5.6.1: "Interfaces that support indexed properties must define an
 * integer-typed attribute named `length`." An interface supports indexed
 * properties when it defines an indexed property getter.
 *
 * @see https://webidl.spec.whatwg.org/#idl-indexed-properties
 */
export function validateIndexedPropertiesLengthAttribute(
  iface: Interface,
): void {
  if (!(iface.indexedPropertyGetter !== undefined)) {
    return;
  }

  const length = iface.members["length"];
  if (
    length === undefined ||
    !isAttribute(length) ||
    !isIntegerType(length.type)
  ) {
    throw TypeError(
      'An interface that supports indexed properties must define an integer-typed attribute named "length".',
    );
  }
}

/**
 * § 2.5.6.1: an interface that supports indexed properties must define a way to
 * determine its supported property indices. An interface supports indexed
 * properties when it defines an indexed property getter.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices
 */
export function validateSupportedPropertyIndicesDefined(
  iface: Interface,
): void {
  if (
    iface.indexedPropertyGetter !== undefined &&
    iface.behaviors.supportedPropertyIndices === undefined
  ) {
    throw TypeError(
      "An interface that supports indexed properties must define its supported property indices.",
    );
  }
}
