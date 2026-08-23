import { PlatformObject, type Interface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export function supportsNamedProperties(obj: PlatformObject): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(obj);

  return iface.namedPropertyGetter !== undefined;
}

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export function isInterfaceSupportNamedProperties(iface: Interface): boolean {
  return iface.namedPropertyGetter !== undefined;
}
