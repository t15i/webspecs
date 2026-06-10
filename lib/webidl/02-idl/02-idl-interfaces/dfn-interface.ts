import type { Member, Identifier } from "@webidl";

export const staticMembers: unique symbol = Symbol.for(
  "@t15i/webidl/staticMembers",
);

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  [staticMembers]: Record<Identifier, Member>;
  [key: Identifier]: Member;
}
