import {
  validateAtMostOneSpecialOperationPerVariety,
  validateExposedOverloads,
  validateIndexedPropertiesLengthAttribute,
  validateIndexedPropertyGetterDeterminator,
  validateIndexedPropertySetterConstraints,
  validateNamedPropertyDeleterConstraints,
  validateNamedPropertyGetterDeterminator,
  validateNamedPropertySetterConstraints,
  validateNamedSpecialOperationsAreMembers,
  validateOverloads,
  validateSupportedPropertyIndicesDefined,
  validateSupportedPropertyNamesDefined,
  validateUnforgeableInheritance,
  validateUnforgeableOverloads,
} from "@webidl";
import type { Interface } from "@webidl";

// The registry of extra interface-level validation rules, assembled from the
// rule functions exported alongside the constructs they constrain.
//
// TODO: Further interface-level invariants that cannot be expressed yet,
// because `Interface` does not model the constructs they constrain. Implement
// each as a rule function exported from that section's module and add it to the
// array below once the model grows the missing piece:
//   - § 2.5.5  at most one stringifier (stringifiers not modelled).
//   - § 2.5.9  iterable declaration: at most one, reserved member names, value/pair type rules (iterable declarations not modelled).
//   - § 2.5.10 asynchronously iterable declaration: analogous constraints (not modelled).
//   - § 2.5.11 maplike declaration: at most one map/set/iterable declaration, reserved member names (maplike not modelled).
//   - § 2.5.12 setlike declaration: analogous constraints (setlike not modelled).
export const interfaceExtraValidationRules: ((iface: Interface) => void)[] = [
  validateNamedSpecialOperationsAreMembers,
  validateAtMostOneSpecialOperationPerVariety,
  validateIndexedPropertiesLengthAttribute,
  validateSupportedPropertyIndicesDefined,
  validateSupportedPropertyNamesDefined,
  validateIndexedPropertyGetterDeterminator,
  validateIndexedPropertySetterConstraints,
  validateNamedPropertyGetterDeterminator,
  validateNamedPropertySetterConstraints,
  validateNamedPropertyDeleterConstraints,
  validateOverloads,
  validateExposedOverloads,
  validateUnforgeableOverloads,
  validateUnforgeableInheritance,
];
