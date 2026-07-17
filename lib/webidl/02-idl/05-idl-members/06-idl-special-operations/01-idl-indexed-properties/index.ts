import {
  IndexedPropertyGetter,
  interfaceExtraValidationRules,
  isAttribute,
  isIntegerType,
} from "@webidl";

export * from "./dfn-determine-the-value-of-an-indexed-property";
export * from "./dfn-set-the-value-of-a-new-indexed-property";
export * from "./dfn-set-the-value-of-an-existing-indexed-property";
export * from "./dfn-support-indexed-properties";
export * from "./dfn-supported-property-indices";

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
