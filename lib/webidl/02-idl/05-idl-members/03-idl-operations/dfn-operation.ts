import {
  isIdentifier,
  isSpecialOperation,
  isStaticOperation,
  validateSpecialOperation,
  validateStaticOperation,
} from "@webidl";
import type { Identifier, Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#prod-Argument */
export interface Argument<T extends Type = Type> {
  type: T;

  /** @see https://webidl.spec.whatwg.org/#prod-ArgumentName */
  identifier: Identifier;

  /** @see https://webidl.spec.whatwg.org/#dfn-optional-argument */
  keywords: Set<string>;

  /** @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value */
  defaultValue?: ReturnType<T> | undefined;
}

/** @see https://webidl.spec.whatwg.org/#prod-ArgumentList */
export type ArgumentList<Args extends readonly Type[]> = {
  [K in keyof Args]: Argument<Args[K]>;
};

/** @see https://webidl.spec.whatwg.org/#dfn-optional-argument */
export function isOptionalArgument(argument: Argument): boolean {
  return argument.keywords.has("optional");
}

/** @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value */
export function isDeclaredWithDefaultValue(argument: Argument): boolean {
  return Object.hasOwn(argument, "defaultValue");
}

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

    if (isDeclaredWithDefaultValue(argument) && !isOptionalArgument(argument)) {
      throw TypeError(
        `Only an optional argument can be declared with a default value, but "${argument.identifier}" is not optional.`,
      );
    }
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
export function isOperation(member: Member): member is Operation {
  return member.kind === "operation";
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
}
