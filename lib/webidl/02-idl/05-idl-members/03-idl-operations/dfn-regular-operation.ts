import { isStaticOperation, type Operation, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegularOperation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> extends Operation<Args, Return> {}

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export function isRegularOperation(op: Operation): boolean {
  return op.identifier !== undefined && !isStaticOperation(op);
}
