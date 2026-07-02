import type { UndefinedType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-undefined */
export function asUndefined(
  this: UndefinedType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: unknown,
): undefined {
  return;
}
