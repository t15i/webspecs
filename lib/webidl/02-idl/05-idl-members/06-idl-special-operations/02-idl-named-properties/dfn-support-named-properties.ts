import {
  type PlatformObject,
  NamedPropertyGetter,
  implementsInterfaceWith,
  type Interface,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export function supportsNamedProperties(obj: PlatformObject): boolean {
  return implementsInterfaceWith(obj, NamedPropertyGetter);
}

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export function isInterfaceSupportNamedProperties(iface: Interface): boolean {
  return NamedPropertyGetter in iface.members;
}
