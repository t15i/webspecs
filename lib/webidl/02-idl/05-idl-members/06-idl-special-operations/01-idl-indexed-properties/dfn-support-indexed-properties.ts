import {
  type PlatformObject,
  IndexedPropertyGetter,
  implementsInterfaceWith,
  type ImplementsInterfaceWith,
} from "@webidl";

export type SupportIndexedProperties = ImplementsInterfaceWith<
  PlatformObject,
  typeof IndexedPropertyGetter
>;

/** @see https://webidl.spec.whatwg.org/#dfn-support-indexed-properties */
export function supportsIndexedProperties(
  obj: PlatformObject,
): obj is SupportIndexedProperties {
  return implementsInterfaceWith(obj, IndexedPropertyGetter);
}
