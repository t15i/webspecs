import {
  isAttribute,
  isOperation,
  validateAttribute,
  validateOperation,
} from "@webidl";
import type { Attribute, Operation } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-member */
export type Member = Operation | Attribute;

/**
 * Validates a member of any kind by dispatching to the validator for its
 * family. The identifier is validated by each family's validator rather than
 * here, because an attribute must be named whereas an operation need not be.
 */
export function validateMember(member: Member): void {
  if (isAttribute(member)) {
    validateAttribute(member);
  } else if (isOperation(member)) {
    validateOperation(member);
  }
}
