import {
  IndexedPropertyGetter,
  SupportedPropertyIndices,
  interfaceExtraValidationRules,
  isAttribute,
  isIntegerType,
} from "@webidl";
import type { Type, UnsignedLongType } from "webidl/02-idl/13-idl-types";
import type { SpecialOperation } from "../dfn-special-operation";

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
interfaceExtraValidationRules.push((iface) => {
  if (!(IndexedPropertyGetter in iface.members)) {
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
});

/**
 * § 2.5.6.1: an interface that supports indexed properties must define a way to
 * determine its supported property indices. An interface supports indexed
 * properties when it defines an indexed property getter.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices
 */
interfaceExtraValidationRules.push((iface) => {
  if (
    IndexedPropertyGetter in iface.members &&
    !(SupportedPropertyIndices in iface.members)
  ) {
    throw TypeError(
      "An interface that supports indexed properties must define its supported property indices.",
    );
  }
});
