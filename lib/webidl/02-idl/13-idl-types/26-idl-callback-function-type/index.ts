import type { Type } from "@webidl";

export const CALLBACK_FUNCTION_TYPE_NAME = "callback";

/** @see https://webidl.spec.whatwg.org/#idl-callback-function */
export interface CallbackFunctionType extends Type<CallableFunction> {
  name: typeof CALLBACK_FUNCTION_TYPE_NAME;
}

export function isCallbackFunctionType(T: Type): T is CallbackFunctionType {
  return T.name === CALLBACK_FUNCTION_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [CALLBACK_FUNCTION_TYPE_NAME]: CallbackFunctionType;
  }
}
