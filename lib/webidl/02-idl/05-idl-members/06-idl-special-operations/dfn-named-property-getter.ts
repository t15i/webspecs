import { isDOMStringType, type Interface, type Operation } from "@webidl";
import type { NamedPropertyGetterOperation } from "./02-idl-named-properties";

declare module "@webidl" {
  interface Interface {
    /** @see https://webidl.spec.whatwg.org/#dfn-named-property-getter */
    namedPropertyGetter?: NamedPropertyGetterOperation;
  }
}

/**
 * Argument-shape validation for a named property getter: it must take a single
 * "DOMString" argument.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-named-property-getter
 */
export function validateNamedPropertyGetter(op: Operation): void {
  if (op.arguments.length !== 1 || !isDOMStringType(op.arguments[0]!.type)) {
    throw TypeError(
      `A named property getter must take a single "DOMString" argument.`,
    );
  }
}

/**
 * § 2.5.6.2: the value of a named property is determined by invoking the
 * getter. When the getter is declared without an identifier the interface must
 * instead supply the anonymous steps to determine the value of a named
 * property; a named getter determines the value through its own steps.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property
 */
export function validateNamedPropertyGetterDeterminator(
  iface: Interface,
): void {
  const getter = iface.namedPropertyGetter;

  if (
    getter !== undefined &&
    getter.identifier === undefined &&
    iface.behaviors.namedPropertyDeterminator === undefined
  ) {
    throw TypeError(
      "An interface with an unnamed named property getter must define the steps to determine the value of a named property.",
    );
  }
}
