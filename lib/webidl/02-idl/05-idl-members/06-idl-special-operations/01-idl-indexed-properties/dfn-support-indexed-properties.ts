import {
  type PlatformObject,
  IndexedPropertyGetter,
  implementsInterfaceWith,
  type Interface,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function supportsIndexedProperties(obj: PlatformObject): boolean {
  return implementsInterfaceWith(obj, IndexedPropertyGetter);
}

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function isInterfaceSupportIndexedProperties(iface: Interface): boolean {
  return IndexedPropertyGetter in iface.members;
}
