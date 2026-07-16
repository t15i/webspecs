import type {
  Operation,
  StaticOperationExtendedAttributes,
  Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-operation */
export interface StaticOperation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> extends Operation<Args, Return> {
  extendedAttributes: StaticOperationExtendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#dfn-static-operation */
export function isStaticOperation(op: Operation): boolean {
  return op.keywords.has("static");
}
