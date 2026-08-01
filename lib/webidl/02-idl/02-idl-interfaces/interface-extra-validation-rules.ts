import type { Interface } from "@webidl";

// The registry of extra interface-level validation rules.
//
// TODO: Further interface-level invariants that cannot be expressed yet,
// because `Interface` does not model the constructs they constrain. Implement
// each as a rule pushed onto `interfaceExtraValidationRules` from that
// section's `index.ts` once the model grows the missing piece:
//   - § 2.5.5  at most one stringifier (stringifiers not modelled).
//   - § 2.5.9  iterable declaration: at most one, reserved member names, value/pair type rules (iterable declarations not modelled).
//   - § 2.5.10 asynchronously iterable declaration: analogous constraints (not modelled).
//   - § 2.5.11 maplike declaration: at most one map/set/iterable declaration, reserved member names (maplike not modelled).
//   - § 2.5.12 setlike declaration: analogous constraints (setlike not modelled).
export const interfaceExtraValidationRules: ((iface: Interface) => void)[] = [];
