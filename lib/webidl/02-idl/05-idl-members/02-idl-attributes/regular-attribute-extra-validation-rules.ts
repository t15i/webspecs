import type { RegularAttribute } from "@webidl";

type RegularAttributeValidationRule = (attribute: RegularAttribute) => void;

// The registry of extra regular-attribute validation rules
export const regularAttributeExtraValidationRules: RegularAttributeValidationRule[] =
  [];
