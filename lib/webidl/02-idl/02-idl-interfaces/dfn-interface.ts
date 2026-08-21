import {
  isAttribute,
  isConstructorOperation,
  isIdentifier,
  iterateMemberSlots,
  iterateSpecialOperations,
  validateOperation,
  validateRegularMemberSlot,
  validateStaticMemberSlot,
} from "@webidl";
import type { MemberSlot, Identifier } from "@webidl";

import { interfaceExtraValidationRules } from "./interface-extra-validation-rules";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceExtendedAttributes {}

export interface InterfaceStaticMembers {
  [key: Identifier]: MemberSlot;
}

export interface InterfaceMembers {
  // `constructor` is deliberately not declared as a named key: doing so collides
  // with the built-in `Object.prototype.constructor` (a `Function`), so every
  // object literal assigned to this type would fail to typecheck. An own
  // constructor operation is still stored under the `constructor` key at runtime
  // and resolved through `getOwnConstructorOperation`, which reads it by own-key.
  [key: Identifier]: MemberSlot;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceBehaviors {}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  inherit: Interface | null;
  extendedAttributes: InterfaceExtendedAttributes;
  identifier: Identifier;
  staticMembers: InterfaceStaticMembers;
  members: InterfaceMembers;
  behaviors: InterfaceBehaviors;
}

export { interfaceExtraValidationRules };

/**
 * @see https://webidl.spec.whatwg.org/#dfn-member
 */
function validateMemberIdentifier(
  identifier: Identifier,
  slot: MemberSlot,
): void {
  if (isConstructorOperation(slot)) {
    return;
  }

  for (const member of isAttribute(slot) ? [slot] : slot) {
    if (member.identifier !== identifier) {
      throw TypeError(
        `A member of an interface is held under the identifier it declares, but "${identifier}" holds "${String(member.identifier)}".`,
      );
    }
  }
}

export function validateInterface(iface: Interface): void {
  if (!isIdentifier(iface.identifier)) {
    throw TypeError(
      `"${iface.identifier}" is not a valid Web IDL identifier for an interface.`,
    );
  }

  for (const [identifier, slot] of iterateMemberSlots(iface.members)) {
    validateMemberIdentifier(identifier, slot);
    validateRegularMemberSlot(slot);
  }

  for (const [identifier, slot] of iterateMemberSlots(iface.staticMembers)) {
    validateMemberIdentifier(identifier, slot);
    validateStaticMemberSlot(slot);
  }

  for (const operation of iterateSpecialOperations(iface)) {
    validateOperation(operation);
  }

  for (const rule of interfaceExtraValidationRules) {
    rule(iface);
  }
}
