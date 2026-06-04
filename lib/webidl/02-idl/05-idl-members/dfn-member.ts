import type { Attribute, Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export type Member = Operation<unknown[], unknown> | Attribute<unknown>;
