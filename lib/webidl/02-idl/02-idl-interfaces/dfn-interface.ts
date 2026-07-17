import {
  isAttribute,
  isIdentifier,
  isSpecialOperation,
  validateAttribute,
  validateOperation,
  validateSpecialOperation,
} from "@webidl";
import type { Member, Identifier } from "@webidl";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceExtendedAttributes {}

export interface InterfaceStaticMembers {
  [key: Identifier]: Member;
}

export interface InterfaceMembers {
  [key: Identifier]: Member;
}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  extendedAttributes: InterfaceExtendedAttributes;
  identifier: Identifier;
  staticMembers: InterfaceStaticMembers;
  members: InterfaceMembers;
}

export const interfaceExtraValidationRules: ((iface: Interface) => void)[] = [];

// TODO: Further interface-level invariants that cannot be expressed yet,
// because `Interface` does not model the constructs they constrain. Implement
// each as a rule pushed onto `interfaceExtraValidationRules` from that
// section's `index.ts` once the model grows the missing piece:
//   - § 2.5.5  at most one stringifier (stringifiers not modelled).
//   - § 2.5.9  iterable declaration: at most one, reserved member names, value/pair type rules (iterable declarations not modelled).
//   - § 2.5.10 asynchronously iterable declaration: analogous constraints (not modelled).
//   - § 2.5.11 maplike declaration: at most one map/set/iterable declaration, reserved member names (maplike not modelled).
//   - § 2.5.12 setlike declaration: analogous constraints (setlike not modelled).

export function validateInterface(iface: Interface): void {
  if (!isIdentifier(iface.identifier)) {
    throw TypeError(
      `"${iface.identifier}" is not a valid Web IDL identifier for an interface.`,
    );
  }

  for (const members of [iface.staticMembers, iface.members]) {
    for (const key of Reflect.ownKeys(members)) {
      const member = Reflect.get(members, key) as Member;

      if (isAttribute(member)) {
        validateAttribute(member);
      } else if (isSpecialOperation(member)) {
        validateSpecialOperation(member);
      } else {
        validateOperation(member);
      }
    }
  }

  for (const rule of interfaceExtraValidationRules) {
    rule(iface);
  }
}
