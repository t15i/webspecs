import { type PlatformObject, PrimaryInterface } from "@webidl";

export const ExistingIndexedPropertySetter: unique symbol = Symbol(
  "ExistingIndexedPropertySetter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [ExistingIndexedPropertySetter]?(index: number, value: unknown): void;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-set-the-value-of-an-existing-indexed-property */
export function setValueOfExistingIndexedProperty(
  o: PlatformObject,
  index: number,
  value: unknown,
): void {
  o[PrimaryInterface].members[ExistingIndexedPropertySetter]!.call(
    o,
    index,
    value,
  );
}
