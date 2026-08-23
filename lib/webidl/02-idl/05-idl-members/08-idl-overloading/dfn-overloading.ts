import {
  computeEffectiveOverloadSet,
  isConstructorOperation,
  isOperation,
  isPromiseType,
  iterateMemberSlots,
  type Interface,
  type Operation,
} from "@webidl";

import { validateEffectiveOverloadSet } from "./dfn-effective-overload-set";

/** @see https://webidl.spec.whatwg.org/#idl-overloading */
function validateOverloadedReturnTypes(operations: Operation[]): void {
  const promises = operations.filter((op) => isPromiseType(op.returnType));

  if (promises.length !== 0 && promises.length !== operations.length) {
    throw TypeError(
      `A set of overloaded operations must either contain no operations whose return type is a promise type, or only such operations, but "${String(operations[0]!.identifier)}" mixes them.`,
    );
  }
}

/** @see https://webidl.spec.whatwg.org/#idl-overloading */
export function validateOverloads(iface: Interface): void {
  for (const [identifier, slot] of iterateMemberSlots(iface.members)) {
    if (isConstructorOperation(slot)) {
      validateEffectiveOverloadSet(
        computeEffectiveOverloadSet("constructor", iface.identifier, 0, iface),
      );
    } else if (isOperation(slot)) {
      validateOverloadedReturnTypes(slot);
      validateEffectiveOverloadSet(
        computeEffectiveOverloadSet("regular", identifier, 0, iface),
      );
    }
  }

  for (const [identifier, slot] of iterateMemberSlots(iface.staticMembers)) {
    if (!isOperation(slot)) {
      continue;
    }

    validateOverloadedReturnTypes(slot);
    validateEffectiveOverloadSet(
      computeEffectiveOverloadSet("static", identifier, 0, iface),
    );
  }
}
