import type {
  ConstructorOperationEffectiveOverloadSet,
  ConstructorOperationEffectiveOverloadSetCallable,
  OperationEffectiveOverloadSet,
  OperationEffectiveOverloadSetCallable,
} from "@webidl";

export function resolveOverloads(
  S: ConstructorOperationEffectiveOverloadSet,
  args: unknown[],
): [ConstructorOperationEffectiveOverloadSetCallable, unknown[]];

export function resolveOverloads(
  S: OperationEffectiveOverloadSet,
  args: unknown[],
): [OperationEffectiveOverloadSetCallable, unknown[]];

/** @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm */
export function resolveOverloads(
  S: ConstructorOperationEffectiveOverloadSet | OperationEffectiveOverloadSet,
  args: unknown[],
) {
  const overload = S[Symbol.iterator]().next().value;

  if (overload === undefined) {
    throw TypeError("The effective overload set is empty.");
  }

  const [callable, typeList] = overload;

  if (args.length < typeList.length) {
    throw TypeError(
      `At least ${typeList.length} argument${
        typeList.length === 1 ? "" : "s"
      } required, but only ${args.length} passed`,
    );
  }

  const values = typeList.map((type, index) => type(args[index]));

  // TODO (overloading):

  return [callable, values] as
    | [OperationEffectiveOverloadSetCallable, unknown[]]
    | [ConstructorOperationEffectiveOverloadSetCallable, unknown[]];
}
