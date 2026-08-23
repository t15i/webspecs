import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

declare module "@webidl" {
  interface InterfaceBehaviors {
    /** @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property */
    existingNamedPropertyDeleter?(index: PropertyName): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property */
export function deleteExistingNamedProperty(
  o: PlatformObject,
  property: PropertyName,
): void {
  const iface = PlatformObject.getPrimaryInterfaceOf(o);

  return iface.behaviors.existingNamedPropertyDeleter!.call(o, property);
}
