import type { Member, Identifier } from "@webidl";

export interface InterfaceStaticMembers {
  [key: Identifier]: Member;
}

export interface InterfaceMembers {
  [key: Identifier]: Member;
}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  // [Extended Attributes]

  identifier: Identifier;
  staticMembers: InterfaceStaticMembers;
  members: InterfaceMembers;
}
