import type { Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export interface Attribute<T> {
  memberType: "attribute";
  type: Type<T>;
}

export function isAttribute<T = unknown>(
  member: Member,
): member is Attribute<T> {
  return member.memberType === "attribute";
}
