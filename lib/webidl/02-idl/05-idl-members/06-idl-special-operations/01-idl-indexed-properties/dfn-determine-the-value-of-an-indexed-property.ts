import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property */
    indexedPropertyDeterminator?(index: number): unknown;
  }
}

/** @see webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property */
export function determineValueOfIndexedProperty(
  o: PlatformObject,
  index: number,
): unknown {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  return iface.behaviors.indexedPropertyDeterminator!.call(o, index);
}
