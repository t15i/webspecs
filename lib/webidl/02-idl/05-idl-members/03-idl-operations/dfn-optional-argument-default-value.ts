import { isOptionalArgument, type Argument, type Type } from "@webidl";

declare module "@webidl" {
  interface Argument<T extends Type = Type> {
    /** @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value */
    defaultValue?: ReturnType<T> | undefined;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value */
export function isDeclaredWithDefaultValue(argument: Argument): boolean {
  return Object.hasOwn(argument, "defaultValue");
}

/** @see https://webidl.spec.whatwg.org/#dfn-optional-argument-default-value */
export function validateArgumentDefaultValue(argument: Argument): void {
  if (isDeclaredWithDefaultValue(argument) && !isOptionalArgument(argument)) {
    throw TypeError(
      `Only an optional argument can be declared with a default value, but "${argument.identifier}" is not optional.`,
    );
  }
}
