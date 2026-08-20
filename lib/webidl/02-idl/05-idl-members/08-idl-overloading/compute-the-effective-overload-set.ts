import {
  getOwnConstructorOperation,
  isConstructorOperation,
  isOperation,
  isOptionalArgument,
  type Argument,
  type Identifier,
  type Interface,
  type Member,
  type Type,
} from "@webidl";

import type {
  ConstructorOperationEffectiveOverloadSet,
  EffectiveOverloadSet,
  OperationEffectiveOverloadSet,
} from "./dfn-effective-overload-set";
import type { EffectiveOverloadSetOptionalityValue } from "./dfn-optionality-value";

export function computeEffectiveOverloadSet(
  kind: "regular" | "static",
  id: Identifier,
  n: number,
  iface: Interface,
): OperationEffectiveOverloadSet;

export function computeEffectiveOverloadSet(
  kind: "constructor",
  id: Identifier,
  n: number,
  iface: Interface,
): ConstructorOperationEffectiveOverloadSet;

/** @see https://webidl.spec.whatwg.org/#compute-the-effective-overload-set */
export function computeEffectiveOverloadSet(
  kind: "regular" | "static" | "constructor",
  id: Identifier,
  n: number,
  iface: Interface,
): EffectiveOverloadSet {
  const S = new Set();

  let op: Member | undefined;
  switch (kind) {
    case "regular":
      op = iface.members[id];
      break;
    case "static":
      op = iface.staticMembers[id];
      break;
    case "constructor":
      op = getOwnConstructorOperation(iface);
      break;
  }

  if (op && (isOperation(op) || isConstructorOperation(op))) {
    const args: readonly Argument[] = op.arguments;

    const types: Type[] = args.map((argument) => argument.type);
    const optionalityValues: EffectiveOverloadSetOptionalityValue[] = args.map(
      (argument) => (isOptionalArgument(argument) ? "optional" : "required"),
    );

    S.add([op, types, optionalityValues]);

    for (let i = args.length - 1; i >= 0 && isOptionalArgument(args[i]!); --i) {
      S.add([op, types.slice(0, i), optionalityValues.slice(0, i)]);
    }
  }

  // TODO (overloading): F is built from every operation on the interface with
  // identifier A. An interface holds at most one member per identifier, so F is
  // a singleton and only that member contributes to S.

  return S as EffectiveOverloadSet;
}
