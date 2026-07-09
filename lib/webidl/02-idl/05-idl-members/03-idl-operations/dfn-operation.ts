import type { Member, Type } from "@webidl";

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
  identifier: string | undefined;
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
