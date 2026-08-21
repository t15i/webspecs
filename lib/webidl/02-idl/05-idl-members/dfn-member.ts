import {
  isAttribute,
  isConstructorOperation,
  isOperation,
  validateAttribute,
  validateConstructorOperation,
  validateOperation,
} from "@webidl";
import type {
  Attribute,
  ConstructorOperation,
  Identifier,
  InterfaceMembers,
  InterfaceStaticMembers,
  Operation,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export type Member = Operation | Attribute | ConstructorOperation;

/** @see https://webidl.spec.whatwg.org/#dfn-overloaded */
export type MemberSlot = Attribute | Operation[] | ConstructorOperation[];

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export function* iterateMemberSlots(
  members: InterfaceMembers | InterfaceStaticMembers,
): Generator<[Identifier, MemberSlot]> {
  // `Object.keys` leaves out the symbol-keyed slots, which carry the machinery
  // of special operations rather than members.
  for (const identifier of Object.keys(members)) {
    const slot = Reflect.get(members, identifier) as MemberSlot;

    if (Array.isArray(slot) || isAttribute(slot)) {
      yield [identifier, slot];
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export function* iterateMembers(
  members: InterfaceMembers | InterfaceStaticMembers,
): Generator<[Identifier, Member]> {
  for (const [identifier, slot] of iterateMemberSlots(members)) {
    if (isAttribute(slot)) {
      yield [identifier, slot];
      continue;
    }

    for (const member of slot) {
      yield [identifier, member];
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-overloaded */
function validateOverloadsOfOneKind(
  members: (Operation | ConstructorOperation)[],
): void {
  const first = members[0]!;

  for (const member of members) {
    if (member.kind !== first.kind) {
      throw TypeError(
        `The operations overloaded under one identifier must all be of the same kind, but "${first.kind}" and "${member.kind}" are declared together.`,
      );
    }

    if (member.kind === "operation" && first.kind === "operation") {
      if (member.identifier !== first.identifier) {
        throw TypeError(
          `The operations overloaded under one identifier must all declare it, but "${String(first.identifier)}" and "${String(member.identifier)}" are declared together.`,
        );
      }
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export function validateMemberSlot(slot: MemberSlot): void {
  if (Array.isArray(slot) && slot.length === 0) {
    throw TypeError(
      `A member of an interface must declare at least one operation.`,
    );
  }

  if (isAttribute(slot)) {
    validateAttribute(slot);
  } else if (isOperation(slot)) {
    validateOverloadsOfOneKind(slot);

    for (const op of slot) {
      validateOperation(op);
    }
  } else if (isConstructorOperation(slot)) {
    validateOverloadsOfOneKind(slot);

    for (const ctor of slot) {
      validateConstructorOperation(ctor);
    }
  } else {
    throw TypeError(`A member must be an attribute or an operation.`);
  }
}
