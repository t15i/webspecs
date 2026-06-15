import { type PropertyName } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";

export const NamedPropertyDeterminator: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NamedPropertyDeterminator",
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
  return o[PrimaryInterface].members[NamedPropertyDeterminator]!.call(
    o,
    property,
  );
}
