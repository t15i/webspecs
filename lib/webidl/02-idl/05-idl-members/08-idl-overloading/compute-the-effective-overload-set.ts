import {
  getOwnConstructorOperation,
  isConstructorOperation,
  isOperation,
  type Identifier,
  type Interface,
  type Member,
} from "@webidl";

import type {
  ConstructorOperationEffectiveOverloadSet,
  EffectiveOverloadSet,
  OperationEffectiveOverloadSet,
} from "./dfn-effective-overload-set";

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
    S.add([
      op,
      op.arguments.map((arg) => arg.type),
      op.arguments.map(() => "required" as const),
    ]);
  }

  // TODO (overloading)

  return S as EffectiveOverloadSet;
}
