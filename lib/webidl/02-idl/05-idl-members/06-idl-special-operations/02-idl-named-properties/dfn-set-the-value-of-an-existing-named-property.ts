import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-named-property */
    existingNamedPropertySetter?(index: PropertyName, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-named-property */
export function setValueOfExistingNamedProperty(
  o: PlatformObject,
  property: PropertyName,
  value: unknown,
): void {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  iface.behaviors.existingNamedPropertySetter!.call(o, property, value);
}
