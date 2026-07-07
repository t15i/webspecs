import { type PropertyName } from "@ecma";
import { PlatformObject } from "@webidl";

export const NamedPropertyDeterminator: unique symbol = Symbol(
  "NamedPropertyDeterminator",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [NamedPropertyDeterminator]?(name: string): unknown;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property */
export function determineValueOfNamedProperty(
  o: PlatformObject,
  property: PropertyName,
): unknown {
  return PlatformObject.getPrimaryInterfaceOf(o).members[
    NamedPropertyDeterminator
  ]!.call(o, property);
}
