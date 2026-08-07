import type { RegularAttribute } from "@webidl";
import {
  validateClampedToRange,
  validateDefaultValue,
  validateLimitedToOnlyKnownValues,
  validateLimitedToOnlyNonNegativeNumbers,
  validateLimitedToOnlyPositiveNumbers,
  validateLimitedToOnlyPositiveNumbersWithFallback,
  validateReflectionExtendedAttributes,
  validateTreatedAsURL,
} from "@html";

type RegularAttributeValidationRule = (attribute: RegularAttribute) => void;

// The registry of extra regular-attribute validation rules, assembled from the
// HTML reflection rule functions that constrain reflected IDL attributes.
export const regularAttributeExtraValidationRules: RegularAttributeValidationRule[] =
  [
    validateDefaultValue,
    validateLimitedToOnlyKnownValues,
    validateLimitedToOnlyNonNegativeNumbers,
    validateLimitedToOnlyPositiveNumbers,
    validateLimitedToOnlyPositiveNumbersWithFallback,
    validateTreatedAsURL,
    validateClampedToRange,
    validateReflectionExtendedAttributes,
  ];
