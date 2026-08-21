import { validateUnforgeablePlacement } from "@webidl";
import type { Operation } from "@webidl";

type OperationValidationRule = (operation: Operation) => void;

export const operationExtraValidationRules: OperationValidationRule[] = [
  validateUnforgeablePlacement,
];
