import {
  asMemberList,
  type Interface,
  type Identifier,
  LegacyUnforgeable,
  isAttribute,
  isOperation,
  isAnnotatedWithExtAttribute,
  type Member,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface */
export function isUnforgeableOnInterface(
  a: Interface,
  identifier: Identifier,
): boolean {
  if (!Object.hasOwn(a.members, identifier)) {
    return false;
  }

  return isUnforgeable(a.members[identifier]!);
}

export function isUnforgeable(member: Member): boolean {
  if (isAttribute(member)) {
    return isAnnotatedWithExtAttribute(member, LegacyUnforgeable);
  }

  if (!isOperation(member)) {
    return false;
  }

  const operations = asMemberList(member);

  return (
    operations.length > 0 &&
    operations.every((op) => isAnnotatedWithExtAttribute(op, LegacyUnforgeable))
  );
}

/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export function validateUnforgeableOverloads(a: Interface): void {
  for (const key of Reflect.ownKeys(a.members)) {
    const member = Reflect.get(a.members, key) as Member;

    if (!isOperation(member)) {
      continue;
    }

    const operations = asMemberList(member);
    const unforgeable = operations.filter((op) =>
      isAnnotatedWithExtAttribute(op, LegacyUnforgeable),
    );

    if (unforgeable.length !== 0 && unforgeable.length !== operations.length) {
      throw TypeError(
        `If [LegacyUnforgeable] appears on an operation, then it must appear on all operations with the same identifier on that interface, but "${String(key)}" declares it on only some of its overloads.`,
      );
    }
  }
}
