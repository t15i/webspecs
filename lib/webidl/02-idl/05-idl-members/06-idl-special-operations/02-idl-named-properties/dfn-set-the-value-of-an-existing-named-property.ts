import { type PropertyKey } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";

export const ExistingNamedPropertySetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/ExistingNamedPropertySetter",
);

declare module "@webidl" {
  interface Interface {
    [ExistingNamedPropertySetter]?(index: PropertyKey, value: unknown): boolean;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-named-property */
export function setValueOfExistingNamedProperty(
  o: PlatformObject,
  property: PropertyKey,
  value: unknown,
): boolean {
  return o[PrimaryInterface][ExistingNamedPropertySetter]!.call(
    o,
    property,
    value,
  );
}
