import { isUnsignedLongType, type Interface, type Operation } from "@webidl";
import type { IndexedPropertyGetterOperation } from "./01-idl-indexed-properties";

declare module "@webidl" {
  interface Interface {
    /** @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter */
    indexedPropertyGetter?: IndexedPropertyGetterOperation;
  }
}

/**
 * Tests, at the level of an interface definition, whether the interface has an
 * indexed property getter — i.e. defines one. The object-level counterpart is
 * `supportsIndexedProperties`.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-indexed-property-getter
 */
export function interfaceHasIndexedPropertyGetter(iface: Interface): boolean {
  return iface.indexedPropertyGetter !== undefined;
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

/**
 * § 2.5.6.1: the value of an indexed property is determined by invoking the
 * getter. When the getter is declared without an identifier the interface must
 * instead supply the anonymous steps to determine the value of an indexed
 * property; a named getter determines it through its own steps.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property
 */
export function validateIndexedPropertyGetterDeterminator(
  iface: Interface,
): void {
  const getter = iface.indexedPropertyGetter;

  if (
    getter !== undefined &&
    getter.identifier === undefined &&
    iface.behaviors.indexedPropertyDeterminator === undefined
  ) {
    throw TypeError(
      "An interface with an unnamed indexed property getter must define the steps to determine the value of an indexed property.",
    );
  }
}
