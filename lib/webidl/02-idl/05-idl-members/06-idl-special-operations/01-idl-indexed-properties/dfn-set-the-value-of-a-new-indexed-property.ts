import { type PlatformObject, PrimaryInterface } from "@webidl";

export const NewIndexedPropertySetter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/NewIndexedPropertySetter",
);

declare module "@webidl" {
  interface Interface {
    [NewIndexedPropertySetter]?(index: number, value: unknown): boolean;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-indexed-property */
export function setValueOfNewIndexedProperty(
  o: PlatformObject,
  index: number,
  value: unknown,
): boolean {
  return o[PrimaryInterface][NewIndexedPropertySetter]!.call(o, index, value);
}
