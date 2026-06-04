import type { Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#prod-Argument */
export interface Argument<T> {
  type: Type<T>;
}

/** @see https://webidl.spec.whatwg.org/#prod-ArgumentList */
export type ArgumentList<Args extends readonly unknown[]> = {
  [K in keyof Args]: Argument<Args[K]>;
};

/** @see https://webidl.spec.whatwg.org/#dfn-regular-operation */
export interface Operation<Args extends unknown[], Return> {
  memberType: "operation";
  keywords: ReadonlySet<string>;
  identifier: string | undefined;
  arguments: ArgumentList<Args>;
  returnType: Type<Return>;
  methodSteps(...args: Args): Return;
}

export function isOperation<
  Args extends unknown[] = unknown[],
  Return = unknown,
>(member: Member): member is Operation<Args, Return> {
  return member.memberType === "operation";
}
