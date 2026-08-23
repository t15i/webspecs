import { isOperation, isSpecialOperation, iterateMembers } from "@webidl";
import type { Interface, Operation } from "@webidl";

export * from "./01-idl-indexed-properties";
export * from "./02-idl-named-properties";

export * from "./dfn-special-operation";
export * from "./dfn-indexed-property-getter";
export * from "./dfn-indexed-property-setter";
export * from "./dfn-named-property-deleter";
export * from "./dfn-named-property-getter";
export * from "./dfn-named-property-setter";

/**
 * The special operations an interface defines. Each variety has a field of its
 * own, holding the one operation § 2.5.6 allows it. The field is where every
 * one of them is found, named or not, because the canonical declaration of a
 * special operation carries no identifier to be keyed by.
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
export function* iterateSpecialOperations(
  iface: Interface,
): Generator<Operation> {
  const varieties = [
    iface.indexedPropertyGetter,
    iface.indexedPropertySetter,
    iface.namedPropertyGetter,
    iface.namedPropertySetter,
    iface.namedPropertyDeleter,
  ];

  for (const operation of varieties) {
    if (operation !== undefined) {
      yield operation;
    }
  }
}

/**
 * § 2.5.6: "Defining a special operation with an identifier is equivalent to
 * separating the special operation out into its own declaration without an
 * identifier."
 *
 * Both declarations the shorthand stands for are kept: the special operation in
 * the field of its variety, and the operation among the members under the
 * identifier it declares, which is what gives it a property of its own.
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
export function validateNamedSpecialOperationsAreMembers(
  iface: Interface,
): void {
  for (const operation of iterateSpecialOperations(iface)) {
    const identifier = operation.identifier;

    if (identifier === undefined) {
      continue;
    }

    const slot = iface.members[identifier];

    if (slot === undefined || !isOperation(slot) || !slot.includes(operation)) {
      throw TypeError(
        `A special operation declared with an identifier is equivalent to declaring it without one alongside an operation of that name, so it must also be a member under it, but "${identifier}" is not.`,
      );
    }
  }
}

/**
 * § 2.5.6: "On a given interface, there must exist at most one named property
 * deleter, and at most one of each variety of getter and setter."
 *
 * An interface defines a special operation by giving it the field of its
 * variety, and declares it among the members too when it names it. A member of
 * the table that carries a special keyword yet is neither is a second
 * declaration of its variety.
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
export function validateAtMostOneSpecialOperationPerVariety(
  iface: Interface,
): void {
  const specialOperations = new Set<Operation>(iterateSpecialOperations(iface));

  for (const [identifier, member] of iterateMembers(iface.members)) {
    if (member.kind !== "operation") {
      continue;
    }

    if (isSpecialOperation(member) && !specialOperations.has(member)) {
      throw TypeError(
        `On a given interface, there must exist at most one named property deleter, and at most one of each variety of getter and setter. The member "${identifier}" is a special operation but is not the one the interface defines for its variety.`,
      );
    }
  }
}
