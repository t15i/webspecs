import {
  type PlatformObject,
  type ImplementsInterfaceWith,
  NamedPropertyGetter,
  implementsInterfaceWith,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-support-named-properties */
export type SupportNamedProperties = ImplementsInterfaceWith<
  PlatformObject,
  typeof NamedPropertyGetter
>;

export function supportsNamedProperties(
  obj: PlatformObject,
): obj is SupportNamedProperties {
  return implementsInterfaceWith(obj, NamedPropertyGetter);
}
