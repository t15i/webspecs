import type { Type, TypeBase } from "@webidl";

export const CALLBACK_FUNCTION_TYPE_NAME = "callback";

/** @see https://webidl.spec.whatwg.org/#idl-callback-function */
export interface CallbackFunctionType extends TypeBase<CallableFunction> {
  name: typeof CALLBACK_FUNCTION_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-callback-function */
export function isCallbackFunctionType(T: Type): T is CallbackFunctionType {
  return T.name === CALLBACK_FUNCTION_TYPE_NAME;
}
