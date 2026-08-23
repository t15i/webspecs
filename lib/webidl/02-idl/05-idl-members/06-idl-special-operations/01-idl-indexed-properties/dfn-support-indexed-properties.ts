import { PlatformObject, type Interface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function supportsIndexedProperties(obj: PlatformObject): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(obj);

  return iface.indexedPropertyGetter !== undefined;
}

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function isInterfaceSupportIndexedProperties(iface: Interface): boolean {
  return iface.indexedPropertyGetter !== undefined;
}
