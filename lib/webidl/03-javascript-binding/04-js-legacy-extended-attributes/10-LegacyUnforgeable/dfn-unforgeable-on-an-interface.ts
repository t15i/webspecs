import {
  type Interface,
  type Identifier,
  LegacyUnforgeable,
  isAttribute,
  isOperation,
  isAnnotatedWithExtAttribute,
  iterateMemberSlots,
  type Attribute,
  type Operation,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface */
export function isUnforgeableOnInterface(
  a: Interface,
  identifier: Identifier,
): boolean {
  if (!Object.hasOwn(a.members, identifier)) {
    return false;
  }

  const slot = a.members[identifier]!;

  if (isAttribute(slot)) {
    return isUnforgeable(slot);
  }

  if (!isOperation(slot)) {
    return false;
  }

  // [LegacyUnforgeable] must appear on every operation with a given identifier
  // if it appears on one, so the first overload answers for the whole slot.
  return isUnforgeable(slot[0]!);
}

/** @see https://webidl.spec.whatwg.org/#dfn-unforgeable-on-an-interface */
export function isUnforgeable(member: Attribute | Operation): boolean {
  return isAnnotatedWithExtAttribute(member, LegacyUnforgeable);
}

/**
 * § 3.4.10: "The [LegacyUnforgeable] extended attribute must not appear on
 * anything other than a regular attribute or a non-static operation."
 *
 * @see https://webidl.spec.whatwg.org/#LegacyUnforgeable
 */
export function validateUnforgeablePlacement(
  member: Attribute | Operation,
): void {
  if (member.keywords.has("static") && isUnforgeable(member)) {
    throw TypeError(
      `The [LegacyUnforgeable] extended attribute must not appear on anything other than a regular attribute or a non-static operation, but "${String(member.identifier)}" declares it and is static.`,
    );
  }
}

/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export function validateUnforgeableOverloads(a: Interface): void {
  for (const [identifier, slot] of iterateMemberSlots(a.members)) {
    if (!isOperation(slot)) {
      continue;
    }

    const unforgeable = slot.filter(isUnforgeable);

    if (unforgeable.length !== 0 && unforgeable.length !== slot.length) {
      throw TypeError(
        `If [LegacyUnforgeable] appears on an operation, then it must appear on all operations with the same identifier on that interface, but "${identifier}" declares it on only some of its overloads.`,
      );
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#LegacyUnforgeable */
export function validateUnforgeableInheritance(b: Interface): void {
  const identifiers = new Set<Identifier>();

  for (const [identifier] of iterateMemberSlots(b.members)) {
    identifiers.add(identifier);
  }

  for (let a = b.inherit; a !== null; a = a.inherit) {
    for (const [identifier] of iterateMemberSlots(a.members)) {
      if (
        isUnforgeableOnInterface(a, identifier) &&
        identifiers.has(identifier)
      ) {
        throw TypeError(
          `If an attribute or operation X is unforgeable on an interface A, and A is one of the inherited interfaces of another interface B, then B must not have a regular attribute or non-static operation with the same identifier as X, but "${b.identifier}" declares "${identifier}", which is unforgeable on "${a.identifier}".`,
        );
      }
    }
  }
}
