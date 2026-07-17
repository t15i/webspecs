import {
  IndexedPropertyGetter,
  IndexedPropertySetter,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  NamedPropertySetter,
  interfaceExtraValidationRules,
} from "@webidl";

export * from "./01-idl-indexed-properties";
export * from "./02-idl-named-properties";

export * from "./dfn-special-operation";
export * from "./dfn-indexed-property-getter";
export * from "./dfn-indexed-property-setter";
export * from "./dfn-named-property-deleter";
export * from "./dfn-named-property-getter";
export * from "./dfn-named-property-setter";

/**
 * § 2.5.6: "If an interface has a setter of a given variety, then it must also
 * have a getter of that variety."
 *
 * Each special operation occupies a distinct symbol key on an interface's
 * members, so the companion "at most one ... of each variety" requirement is
 * upheld structurally and needs no rule here.
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
