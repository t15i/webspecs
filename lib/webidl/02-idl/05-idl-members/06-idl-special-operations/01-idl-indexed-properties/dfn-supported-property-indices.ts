import { PlatformObject } from "@webidl";

export interface SupportedPropertyIndices extends Iterable<number> {
  has(index: number): boolean;
}

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices */
    supportedPropertyIndices?(): SupportedPropertyIndices;
  }
}

export function isSupportedPropertyIndex(
  o: PlatformObject,
  index: number,
): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  return iface.behaviors.supportedPropertyIndices!.call(o).has(index);
}
