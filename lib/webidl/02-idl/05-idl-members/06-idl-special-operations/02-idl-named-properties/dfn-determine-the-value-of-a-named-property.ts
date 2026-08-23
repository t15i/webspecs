import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property */
    namedPropertyDeterminator?(name: string): unknown;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property */
export function determineValueOfNamedProperty(
  o: PlatformObject,
  property: PropertyName,
): unknown {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  return iface.behaviors.namedPropertyDeterminator!.call(o, property);
}
