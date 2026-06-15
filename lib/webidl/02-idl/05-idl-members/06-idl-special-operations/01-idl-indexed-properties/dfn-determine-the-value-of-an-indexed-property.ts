import { type PlatformObject, PrimaryInterface } from "@webidl";

export const IndexedPropertyDeterminator: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/IndexedPropertyDeterminator",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [IndexedPropertyDeterminator]?(index: number): unknown;
  }
}

/** @see webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property */
export function determineValueOfIndexedProperty(
  o: PlatformObject,
  index: number,
): unknown {
  return o[PrimaryInterface].members[IndexedPropertyDeterminator]!.call(
    o,
    index,
  );
}
