import { type PlatformObject, PrimaryInterface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-supported-property-indices */
export const SupportedPropertyIndices: unique symbol = Symbol(
  "SupportedPropertyIndices",
);

export interface SupportedPropertyIndices extends Iterable<number> {
  has(index: number): boolean;
}

declare module "@webidl" {
  interface InterfaceMembers {
    [SupportedPropertyIndices]?(): SupportedPropertyIndices;
  }
}

export function isSupportedPropertyIndex(
  o: PlatformObject,
  index: number,
): boolean {
  return o[PrimaryInterface].members[SupportedPropertyIndices]!.call(o).has(
    index,
  );
}
