import {
  IndexedPropertyDeterminator,
  interfaceExtraValidationRules,
  isUnsignedLongType,
  type Interface,
  type Operation,
} from "@webidl";
import type { IndexedPropertyGetterOperation } from "./01-idl-indexed-properties";

/** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter */
export const IndexedPropertyGetter: unique symbol = Symbol(
  "IndexedPropertyGetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertyGetter]?: IndexedPropertyGetterOperation;
  }
}

/**
 * Tests, at the level of an interface definition, whether the interface has an
 * indexed property getter — i.e. declares a member under the indexed property
 * getter slot. The object-level counterpart is `supportsIndexedProperties`.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter
 */
export function interfaceHasIndexedPropertyGetter(iface: Interface): boolean {
  return IndexedPropertyGetter in iface.members;
}

/**
 * Argument-shape validation for an indexed property getter: it must take a
 * single "unsigned long" argument.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter
 */
export function validateIndexedPropertyGetter(op: Operation): void {
  if (op.arguments.length !== 1 || !isUnsignedLongType(op.arguments[0]!.type)) {
    throw TypeError(
      `An indexed property getter must take a single "unsigned long" argument.`,
    );
  }
}

interfaceExtraValidationRules.push((iface) => {
  const getter = iface.members[IndexedPropertyGetter];

  // § 2.5.6.1: the value of an indexed property is determined by invoking the
  // getter. When the getter is declared without an identifier the interface
  // must instead supply the anonymous steps to determine the value of an
  // indexed property; a named getter determines it through its own steps.
  // https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property
  if (
    getter !== undefined &&
    getter.identifier === undefined &&
    !(IndexedPropertyDeterminator in iface.members)
  ) {
    throw TypeError(
      "An interface with an unnamed indexed property getter must define the steps to determine the value of an indexed property.",
    );
  }
});
