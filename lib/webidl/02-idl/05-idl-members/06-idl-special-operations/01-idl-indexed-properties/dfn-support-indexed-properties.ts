import {
  type PlatformObject,
  IndexedPropertyGetter,
  implementsInterfaceWith,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function supportsIndexedProperties(obj: PlatformObject): boolean {
  return implementsInterfaceWith(obj, IndexedPropertyGetter);
}
