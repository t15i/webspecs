import { type PropertyName } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices */
export const SupportedPropertyNames: unique symbol = Symbol.for(
  "@t15i/web-spec/webidl/SupportedPropertyNames",
);

export interface SupportedPropertyNames extends Iterable<PropertyName> {
  has(index: string): boolean;
}

declare module "@webidl" {
  interface Interface {
    [SupportedPropertyNames]?(): SupportedPropertyNames;
  }
}

export function isSupportedPropertyName(
  o: PlatformObject,
  p: PropertyName,
): boolean {
  return o[PrimaryInterface][SupportedPropertyNames]!.call(o).has(p);
}
