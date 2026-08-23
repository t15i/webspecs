import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property */
    newNamedPropertySetter?(index: PropertyName, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property */
export function setValueOfNewNamedProperty(
  o: PlatformObject,
  property: PropertyName,
  value: unknown,
): void {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  iface.behaviors.newNamedPropertySetter!.call(o, property, value);
}
