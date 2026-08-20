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
export type Member = Operation | Attribute | ConstructorOperation;

/**
 * Validates a member of any kind by dispatching to the validator for its
 * family. The identifier is validated by each family's validator rather than
 * here, because an attribute must be named whereas an operation need not be and
 * a constructor operation has no identifier at all.
 */
export function validateMember(member: Member): void {
  if (isAttribute(member)) {
    validateAttribute(member);
  } else if (isOperation(member)) {
    validateOperation(member);
  } else if (isConstructorOperation(member)) {
    validateConstructorOperation(member);
  } else {
    throw TypeError(`A member must be an attribute or an operation.`);
  }
}
