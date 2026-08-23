import {
  isOperation,
  iterateMemberSlots,
  type InterfaceMembers,
  type InterfaceStaticMembers,
  type Operation,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#es-operations */
export function collectOperations(
  members: InterfaceMembers | InterfaceStaticMembers,
  predicate?: (overloads: Operation[]) => boolean,
): Operation[] {
  const result: Operation[] = [];

  for (const [, slot] of iterateMemberSlots(members)) {
    if (!isOperation(slot) || !(predicate?.(slot) ?? true)) {
      continue;
    }

    const op = slot[0]!;

    if (op.identifier !== undefined) {
      result.push(op);
    }
  }

  return result;
}
