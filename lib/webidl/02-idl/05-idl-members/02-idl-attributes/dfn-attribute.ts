import type { Identifier, Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export interface Attribute<T> {
  memberType: "attribute";
  keywords: Set<string>;
  identifier: Identifier;
  type: Type<T>;
  getterSteps(): T;
  setterSteps(value: T): void;
}

export function isAttribute<T = unknown>(
  member: Member,
): member is Attribute<T> {
  return member.memberType === "attribute";
}
