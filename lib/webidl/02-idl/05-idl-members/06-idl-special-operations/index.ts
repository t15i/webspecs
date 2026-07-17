import {
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  NamedPropertySetter,
  interfaceExtraValidationRules,
  isOperation,
  isSpecialOperation,
} from "@webidl";
import type { Member } from "@webidl";

export * from "./01-idl-indexed-properties";
export * from "./02-idl-named-properties";

export * from "./dfn-special-operation";
export * from "./dfn-indexed-property-getter";
export * from "./dfn-indexed-property-setter";
export * from "./dfn-named-property-deleter";
export * from "./dfn-named-property-getter";
export * from "./dfn-named-property-setter";

const specialOperationSlots = [
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyGetter,
  NamedPropertySetter,
  NamedPropertyDeleter,
];

/**
 * § 2.5.6: "If an interface has a setter of a given variety, then it must also
 * have a getter of that variety."
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
interfaceExtraValidationRules.push((iface) => {
  if (
    IndexedPropertySetter in iface.members &&
    !(IndexedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with an indexed property setter must also have an indexed property getter.",
    );
  }

  if (
    NamedPropertySetter in iface.members &&
    !(NamedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with a named property setter must also have a named property getter.",
    );
  }
});

/**
 * § 2.5.6: "On a given interface, there must exist at most one named property
 * deleter, and at most one of each variety of getter and setter."
 *
 * Every special operation is canonically stored under one of the
 * special-operation symbol slots. Any member that is a special operation yet is
 * not one of the operations registered under those slots is a stray duplicate.
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
interfaceExtraValidationRules.push((iface) => {
  const specialOperations = new Set(
    specialOperationSlots
      .map((slot) => Reflect.get(iface.members, slot))
      .filter((operation) => operation !== undefined),
  );

  for (const key of Reflect.ownKeys(iface.members)) {
    const member = Reflect.get(iface.members, key) as Member;

    if (
      isOperation(member) &&
      isSpecialOperation(member) &&
      !specialOperations.has(member)
    ) {
      throw TypeError(
        `On a given interface, there must exist at most one named property deleter, and at most one of each variety of getter and setter. The member "${String(key)}" is a special operation but is not registered under a special-operation slot.`,
      );
    }
  }
});

/**
 * § 2.5.6: "If it has a named property deleter, then it must also have a named
 * property getter."
 *
 * @see https://webidl.spec.whatwg.org/#idl-special-operations
 */
interfaceExtraValidationRules.push((iface) => {
  if (
    NamedPropertyDeleter in iface.members &&
    !(NamedPropertyGetter in iface.members)
  ) {
    throw TypeError(
      "An interface with a named property deleter must also have a named property getter.",
    );
  }
});
