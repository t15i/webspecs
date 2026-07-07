import {
  type PlatformObject,
  NamedPropertyGetter,
  implementsInterfaceWith,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export function supportsNamedProperties(obj: PlatformObject): boolean {
  return implementsInterfaceWith(obj, NamedPropertyGetter);
}
