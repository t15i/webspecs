import {
  asMemberList,
  computeEffectiveOverloadSet,
  isConstructorOperation,
  isOperation,
  isPromiseType,
  type Interface,
  type Member,
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
  for (const key of Object.keys(iface.members)) {
    const member = Reflect.get(iface.members, key) as Member;

    if (isConstructorOperation(member)) {
      validateEffectiveOverloadSet(
        computeEffectiveOverloadSet("constructor", iface.identifier, 0, iface),
      );
    } else if (isOperation(member)) {
      validateOverloadedReturnTypes(asMemberList(member));
      validateEffectiveOverloadSet(
        computeEffectiveOverloadSet("regular", key, 0, iface),
      );
    }
  }

  for (const key of Object.keys(iface.staticMembers)) {
    const member = Reflect.get(iface.staticMembers, key) as Member;

    if (!isOperation(member)) {
      continue;
    }

    validateOverloadedReturnTypes(asMemberList(member));
    validateEffectiveOverloadSet(
      computeEffectiveOverloadSet("static", key, 0, iface),
    );
  }
}
