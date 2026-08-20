import { isDeclaredWithDefaultValue } from "@webidl";
import type {
  Argument,
  ConstructorOperationEffectiveOverload,
  ConstructorOperationEffectiveOverloadSet,
  ConstructorOperationEffectiveOverloadSetCallable,
  OperationEffectiveOverload,
  OperationEffectiveOverloadSet,
  OperationEffectiveOverloadSetCallable,
} from "@webidl";

const MISSING = Symbol("missing");

function omittedArgumentValue(argument: Argument): unknown {
  return isDeclaredWithDefaultValue(argument) ? argument.defaultValue : MISSING;
}

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
  const entries: (
    | OperationEffectiveOverload
    | ConstructorOperationEffectiveOverload
  )[] = [...S];

  if (entries.length === 0) {
    throw TypeError("The effective overload set is empty.");
  }

  const lengths = entries.map(([, typeList]) => typeList.length);

  const maxarg = Math.max(...lengths);
  const n = args.length;
  const argcount = Math.min(maxarg, n);

  const candidates = entries.filter(
    ([, typeList]) => typeList.length === argcount,
  );

  if (candidates.length === 0) {
    // Arguments beyond the longest type list are ignored, so an argument count
    // no entry accepts is always one below the shortest allowable invocation.
    const required = Math.min(...lengths);
    throw TypeError(
      `At least ${required} argument${
        required === 1 ? "" : "s"
      } required, but only ${n} passed`,
    );
  }

  // TODO (overloading): with more than one candidate left, the distinguishing
  // argument index decides between them — the arguments before it are converted
  // first, then the value at that index selects the single remaining entry. A
  // single operation contributes one entry per type list size, so exactly one
  // entry survives the argument count filter and there is nothing to
  // distinguish.
  const [callable, typeList, optionalityList] = candidates[0]!;

  const values: unknown[] = [];
  let i = 0;

  while (i < argcount) {
    const V = args[i];

    if (optionalityList[i] === "optional" && V === undefined) {
      values.push(omittedArgumentValue(callable.arguments[i]!));
    } else {
      values.push(typeList[i]!(V));
    }

    i += 1;
  }

  while (i < callable.arguments.length) {
    values.push(omittedArgumentValue(callable.arguments[i]!));

    i += 1;
  }

  while (values.length > 0 && values[values.length - 1] === MISSING) {
    values.pop();
  }

  for (let j = 0; j < values.length; ++j) {
    if (values[j] === MISSING) {
      values[j] = undefined;
    }
  }

  return [callable, values] as
    | [OperationEffectiveOverloadSetCallable, unknown[]]
    | [ConstructorOperationEffectiveOverloadSetCallable, unknown[]];
}
