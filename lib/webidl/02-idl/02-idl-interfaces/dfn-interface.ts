import type { Member, Identifier } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  [key: Identifier]: Member;
}
