import {
  getOwnConstructorOperations,
  isConstructorOperation,
  isOperation,
  isOptionalArgument,
  type Argument,
  type ConstructorOperation,
  type Identifier,
  type Interface,
  type MemberSlot,
  type Operation,
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

  let slot: MemberSlot | undefined;
  switch (kind) {
    case "regular":
      slot = iface.members[id];
      break;
    case "static":
      slot = iface.staticMembers[id];
      break;
    case "constructor":
      slot = getOwnConstructorOperations(iface);
      break;
  }

  const F: (Operation | ConstructorOperation)[] =
    slot !== undefined && (isOperation(slot) || isConstructorOperation(slot))
      ? slot
      : [];

  for (const X of F) {
    const args: readonly Argument[] = X.arguments;

    const types: Type[] = args.map((argument) => argument.type);
    const optionalityValues: EffectiveOverloadSetOptionalityValue[] = args.map(
      (argument) => (isOptionalArgument(argument) ? "optional" : "required"),
    );

    S.add([X, types, optionalityValues]);

    for (let i = args.length - 1; i >= 0 && isOptionalArgument(args[i]!); --i) {
      S.add([X, types.slice(0, i), optionalityValues.slice(0, i)]);
    }
  }

  return S as EffectiveOverloadSet;
}
