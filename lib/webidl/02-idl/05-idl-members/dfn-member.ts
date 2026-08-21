import {
  isAttribute,
  isConstructorOperation,
  isOperation,
  validateAttribute,
  validateConstructorOperation,
  validateOperation,
} from "@webidl";
import type { Attribute, ConstructorOperation, Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export type Member =
  | Operation
  | Attribute
  | ConstructorOperation
  | Operation[]
  | ConstructorOperation[];

/** @see https://webidl.spec.whatwg.org/#dfn-overloaded */
export function asMemberList<M>(member: M | M[]): M[] {
  return Array.isArray(member) ? member : [member];
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

    if (isOperation(member) && isOperation(first)) {
      if (member.identifier !== first.identifier) {
        throw TypeError(
          `The operations overloaded under one identifier must all declare it, but "${String(first.identifier)}" and "${String(member.identifier)}" are declared together.`,
        );
      }
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export function validateMember(member: Member): void {
  if (Array.isArray(member) && member.length === 0) {
    throw TypeError(
      `A member of an interface must declare at least one operation.`,
    );
  }

  if (isAttribute(member)) {
    validateAttribute(member);
  } else if (isOperation(member)) {
    const operations = asMemberList(member);

    validateOverloadsOfOneKind(operations);

    for (const op of operations) {
      validateOperation(op);
    }
  } else if (isConstructorOperation(member)) {
    const constructors = asMemberList(member);

    validateOverloadsOfOneKind(constructors);

    for (const ctor of constructors) {
      validateConstructorOperation(ctor);
    }
  } else {
    throw TypeError(`A member must be an attribute or an operation.`);
  }
}
