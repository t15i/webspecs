import {
  isStaticOperation,
  type Operation,
  type RegularOperationExtendedAttributes,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export interface RegularOperation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> extends Operation<Args, Return> {
  extendedAttributes: RegularOperationExtendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export function isRegularOperation(op: Operation): boolean {
  return op.identifier !== undefined && !isStaticOperation(op);
}
