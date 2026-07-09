import type { Identifier, Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export interface Attribute<T extends Type = Type> {
  memberType: "attribute";
  keywords: Set<string>;
  identifier: Identifier;
  type: T;
  getterSteps(): ReturnType<T>;
  setterSteps(value: ReturnType<T>): void;
}

export function isAttribute(member: Member): member is Attribute {
  return member.memberType === "attribute";
}
