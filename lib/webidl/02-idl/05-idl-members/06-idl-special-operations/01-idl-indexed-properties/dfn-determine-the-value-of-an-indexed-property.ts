import {
  type PlatformObject,
  IndexedPropertyGetter,
  PrimaryInterface,
} from "@webidl";

/** @see webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property */
export function determineValueOfIndexedProperty(
  o: PlatformObject,
  index: number,
): unknown {
  return o[PrimaryInterface][IndexedPropertyGetter]!.methodSteps(index);
}
