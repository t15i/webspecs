import {
  isIdentifier,
  isSpecialOperation,
  isStaticOperation,
  validateArgumentDefaultValue,
  validateSpecialOperation,
  validateStaticOperation,
} from "@webidl";
import type { Identifier, MemberSlot, Type } from "@webidl";

import { operationExtraValidationRules } from "./operation-extra-validation-rules";

/** @see https://webidl.spec.whatwg.org/#prod-Argument */
export interface Argument<T extends Type = Type> {
  type: T;

  /** @see https://webidl.spec.whatwg.org/#prod-ArgumentName */
  identifier: Identifier;

  /** @see https://webidl.spec.whatwg.org/#dfn-optional-argument */
  keywords: Set<string>;
}

/** @see https://webidl.spec.whatwg.org/#prod-ArgumentList */
export type ArgumentList<Args extends readonly Type[]> = {
  [K in keyof Args]: Argument<Args[K]>;
};

/** @see https://webidl.spec.whatwg.org/#prod-ArgumentList */
export function validateArgumentList(args: readonly Argument[]): void {
  const identifiers = new Set<Identifier>();

  for (const argument of args) {
    if (!isIdentifier(argument.identifier)) {
      throw TypeError(
        `"${argument.identifier}" is not a valid Web IDL identifier for an argument.`,
      );
    }

    if (identifiers.has(argument.identifier)) {
      throw TypeError(
        `The identifier of each argument must not be the same as the identifier of another argument in the same operation declaration, but "${argument.identifier}" is declared twice.`,
      );
    }
    identifiers.add(argument.identifier);

    validateArgumentDefaultValue(argument);
  }
}

/**
 * The single merge target for extended attributes applicable to operations
 * of any kind.
 *
 * @see https://webidl.spec.whatwg.org/#idl-operations
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OperationExtendedAttributes {}

/** @see https://webidl.spec.whatwg.org/#dfn-operation */
export interface Operation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> {
  kind: "operation";
  extendedAttributes: OperationExtendedAttributes;
  keywords: Set<string>;
  identifier: Identifier | undefined;
  arguments: ArgumentList<Args>;
  returnType: Return;
  methodSteps(
    ...args: {
      [K in keyof Args]: ReturnType<Args[K]>;
    }
  ): ReturnType<Return>;
}

/** @see https://webidl.spec.whatwg.org/#dfn-operation */
export function isOperation(slot: MemberSlot): slot is Operation[] {
  return Array.isArray(slot) && slot[0]?.kind === "operation";
}

/** @see https://webidl.spec.whatwg.org/#dfn-operation */
export function validateOperation(op: Operation): void {
  if (op.identifier !== undefined && !isIdentifier(op.identifier)) {
    throw TypeError(
      `"${op.identifier}" is not a valid Web IDL identifier for an operation.`,
    );
  }

  validateArgumentList(op.arguments);

  if (isSpecialOperation(op)) {
    validateSpecialOperation(op);
  } else if (isStaticOperation(op)) {
    validateStaticOperation(op);
  }

  for (const rule of operationExtraValidationRules) {
    rule(op);
  }
}

export { operationExtraValidationRules };
