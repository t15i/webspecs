import {
  isAttribute,
  isConstructor,
  isOperation,
  validateAttribute,
  validateConstructor,
  validateOperation,
} from "@webidl";
import type { Attribute, Constructor, Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export type Member = Operation | Attribute | Constructor;

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
  } else if (isConstructor(member)) {
    validateConstructor(member);
  }
}
