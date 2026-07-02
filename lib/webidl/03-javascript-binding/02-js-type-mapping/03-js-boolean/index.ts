import type { BooleanType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-boolean */
export function asBoolean(this: BooleanType, v: unknown): boolean {
  return globalThis.Boolean(v);
}
