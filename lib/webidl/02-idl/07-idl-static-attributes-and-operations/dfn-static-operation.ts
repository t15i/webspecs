import type { Operation, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-operation */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StaticOperation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> extends Operation<Args, Return> {}

/** @see https://webidl.spec.whatwg.org/#dfn-static-operation */
export function isStaticOperation(op: Operation): boolean {
  return op.keywords.has("static");
}
