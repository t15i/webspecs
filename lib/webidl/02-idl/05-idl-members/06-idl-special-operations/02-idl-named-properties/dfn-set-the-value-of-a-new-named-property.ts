import { type PropertyName } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";

export const NewNamedPropertySetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NewNamedPropertySetter",
);

declare module "@webidl" {
  interface Interface {
    [NewNamedPropertySetter]?(index: PropertyName, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property */
export function setValueOfNewNamedProperty(
  o: PlatformObject,
  property: PropertyName,
  value: unknown,
): void {
  o[PrimaryInterface][NewNamedPropertySetter]!.call(o, property, value);
}
