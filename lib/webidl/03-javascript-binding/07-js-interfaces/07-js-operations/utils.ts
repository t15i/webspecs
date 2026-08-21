import {
  asMemberList,
  isOperation,
  type Member,
  type Operation,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#es-operations */
export function collectOperations(
  members: object,
  predicate?: (member: Member) => boolean,
): Operation[] {
  const result: Operation[] = [];

  for (const key of Reflect.ownKeys(members)) {
    const member = Reflect.get(members, key) as Member;

    if (!isOperation(member) || !(predicate?.(member) ?? true)) {
      continue;
    }

    // A slot holds every overload of one identifier, and the identifier gets a
    // single property, so one overload stands for the whole slot here. An
    // identifier-less operation is a pure special operation, handled by the
    // legacy platform object machinery instead.
    const [op] = asMemberList(member);

    if (op !== undefined && op.identifier !== undefined) {
      result.push(op);
    }
  }

  return result;
}
