import { isOperation, type Member, type Operation } from "@webidl";

export function collectOperations(
  members: object,
  predicate?: (op: Operation) => boolean,
): Operation[] {
  const result: Operation[] = [];
  for (const key of Reflect.ownKeys(members)) {
    const member = Reflect.get(members, key) as Member;
    // Only operations with an identifier are regular/static operations that get
    // defined as named properties. An identifier-less operation is a pure special
    // operation and is handled by the legacy platform object machinery instead.
    if (
      isOperation(member) &&
      member.identifier !== undefined &&
      (predicate?.(member) ?? true)
    ) {
      result.push(member);
    }
  }
  return result;
}
