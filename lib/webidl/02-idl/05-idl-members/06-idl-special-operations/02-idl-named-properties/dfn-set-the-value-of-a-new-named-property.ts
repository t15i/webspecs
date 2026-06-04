import { type PropertyKey } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";

export const NewNamedPropertySetter: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/NewNamedPropertySetter",
);

declare module "@webidl" {
  interface Interface {
    [NewNamedPropertySetter]?(index: PropertyKey, value: unknown): boolean;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-named-property */
export function setValueOfNewNamedProperty(
  o: PlatformObject,
  property: PropertyKey,
  value: unknown,
): boolean {
  return o[PrimaryInterface][NewNamedPropertySetter]!.call(o, property, value);
}
