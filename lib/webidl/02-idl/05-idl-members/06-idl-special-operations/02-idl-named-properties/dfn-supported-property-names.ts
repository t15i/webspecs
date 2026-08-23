import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

export interface SupportedPropertyNames extends Iterable<PropertyName> {
  has(index: string): boolean;
}

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-supported-property-names */
    supportedPropertyNames?(): SupportedPropertyNames;
  }
}

export function isSupportedPropertyName(
  o: PlatformObject,
  p: PropertyName,
): boolean {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  return iface.behaviors.supportedPropertyNames!.call(o).has(p);
}
