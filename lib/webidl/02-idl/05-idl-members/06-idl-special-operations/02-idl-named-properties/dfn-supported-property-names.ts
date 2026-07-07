import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices */
export const SupportedPropertyNames: unique symbol = Symbol(
  "SupportedPropertyNames",
);

export interface SupportedPropertyNames extends Iterable<PropertyName> {
  has(index: string): boolean;
}

declare module "@webidl" {
  interface InterfaceMembers {
    [SupportedPropertyNames]?(): SupportedPropertyNames;
  }
}

export function isSupportedPropertyName(
  o: PlatformObject,
  p: PropertyName,
): boolean {
  return PlatformObject.getPrimaryInterfaceOf(o)
    .members[SupportedPropertyNames]!.call(o)
    .has(p);
}
