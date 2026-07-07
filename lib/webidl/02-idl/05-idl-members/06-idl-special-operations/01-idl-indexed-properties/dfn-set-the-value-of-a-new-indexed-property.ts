import { PlatformObject } from "@webidl";

export const NewIndexedPropertySetter: unique symbol = Symbol(
  "NewIndexedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [NewIndexedPropertySetter]?(index: number, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-a-new-indexed-property */
export function setValueOfNewIndexedProperty(
  o: PlatformObject,
  index: number,
  value: unknown,
): void {
  PlatformObject.getPrimaryInterfaceOf(o).members[
    NewIndexedPropertySetter
  ]!.call(o, index, value);
}
