import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-indexed-property */
    newIndexedPropertySetter?(index: number, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-indexed-property */
export function setValueOfNewIndexedProperty(
  o: PlatformObject,
  index: number,
  value: unknown,
): void {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  iface.behaviors.newIndexedPropertySetter!.call(o, index, value);
}
