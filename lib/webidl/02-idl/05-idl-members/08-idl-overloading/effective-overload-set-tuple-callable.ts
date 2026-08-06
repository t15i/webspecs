import type { Operation } from "../03-idl-operations";
import type { ConstructorOperation } from "../04-idl-constructors";

/** @see https://webidl.spec.whatwg.org/#effective-overload-set-tuple-callable */
export type EffectiveOverloadSetCallable =
  | OperationEffectiveOverloadSetCallable
  | LegacyFactoryFunctionEffectiveOverloadSetCallable;

/** @see https://webidl.spec.whatwg.org/#effective-overload-set-tuple-callable */
export type OperationEffectiveOverloadSetCallable = Operation;

/** @see https://webidl.spec.whatwg.org/#effective-overload-set-tuple-callable */
export type ConstructorOperationEffectiveOverloadSetCallable =
  ConstructorOperation;

/** @see https://webidl.spec.whatwg.org/#effective-overload-set-tuple-callable */
export type LegacyFactoryFunctionEffectiveOverloadSetCallable = symbol;
