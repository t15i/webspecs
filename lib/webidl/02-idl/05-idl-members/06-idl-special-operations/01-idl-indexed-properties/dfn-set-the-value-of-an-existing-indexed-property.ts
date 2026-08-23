import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-indexed-property */
    existingIndexedPropertySetter?(index: number, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-indexed-property */
export function setValueOfExistingIndexedProperty(
  o: PlatformObject,
  index: number,
  value: unknown,
): void {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  iface.behaviors.existingIndexedPropertySetter!.call(o, index, value);
}
