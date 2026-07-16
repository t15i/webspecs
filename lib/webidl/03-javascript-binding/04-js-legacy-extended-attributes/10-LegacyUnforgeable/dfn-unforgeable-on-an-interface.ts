import {
  type Interface,
  type Identifier,
  LegacyUnforgeable,
  isAttribute,
  isOperation,
  isAnnotatedWithExtAttribute,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface */
export function isUnforgeableOnInterface(
  a: Interface,
  identifier: Identifier,
): boolean {
  if (!Object.hasOwn(a.members, identifier)) {
    return false;
  }

  const member = a.members[identifier]!;

  if (!isOperation(member) && !isAttribute(member)) {
    return false;
  }

  return isAnnotatedWithExtAttribute(member, LegacyUnforgeable);
}
