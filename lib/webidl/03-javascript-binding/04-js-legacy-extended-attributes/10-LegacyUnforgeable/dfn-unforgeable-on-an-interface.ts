import {
  type Interface,
  type Identifier,
  LegacyUnforgeable,
  isAttribute,
  isOperation,
  isAnnotatedWithExtAttribute,
  type Member,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface */
export function isUnforgeableOnInterface(
  a: Interface,
  identifier: Identifier,
): boolean {
  if (!Object.hasOwn(a.members, identifier)) {
    return false;
  }

  return isUnforgeable(a.members[identifier]!);
}

export function isUnforgeable(member: Member): boolean {
  if (!isOperation(member) && !isAttribute(member)) {
    return false;
  }

  return isAnnotatedWithExtAttribute(member, LegacyUnforgeable);
}
