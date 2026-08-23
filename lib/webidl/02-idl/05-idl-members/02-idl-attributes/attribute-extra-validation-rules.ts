import { validateUnforgeablePlacement } from "@webidl";
import type { Attribute } from "@webidl";

type AttributeValidationRule = (attribute: Attribute) => void;

export const attributeExtraValidationRules: AttributeValidationRule[] = [
  validateUnforgeablePlacement,
];
