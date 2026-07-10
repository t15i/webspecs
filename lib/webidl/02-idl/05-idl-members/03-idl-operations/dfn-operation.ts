import { isIdentifier, isStaticOperation } from "@webidl";
import type { Identifier, Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#prod-Argument */
export interface Argument<T extends Type = Type> {
  type: T;
}

/** @see https://webidl.spec.whatwg.org/#prod-ArgumentList */
export type ArgumentList<Args extends readonly Type[]> = {
  [K in keyof Args]: Argument<Args[K]>;
};

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export interface Operation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> {
  memberType: "operation";
  keywords: ReadonlySet<string>;
  identifier: Identifier | undefined;
  arguments: ArgumentList<Args>;
  returnType: Return;
  methodSteps(
    ...args: {
      [K in keyof Args]: ReturnType<Args[K]>;
    }
  ): ReturnType<Return>;
}

export function isOperation(member: Member): member is Operation {
  return member.memberType === "operation";
}

export function validateOperation(op: Operation): void {
  if (op.identifier !== undefined && !isIdentifier(op.identifier)) {
    throw TypeError(
      `"${op.identifier}" is not a valid Web IDL identifier for an operation.`,
    );
  }

  if (isStaticOperation(op) && op.identifier === "prototype") {
    throw TypeError(`A static operation must not be named "prototype".`);
  }
}
