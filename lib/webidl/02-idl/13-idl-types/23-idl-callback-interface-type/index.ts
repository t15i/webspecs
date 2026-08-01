import type { Type, TypeBase } from "@webidl";

export const CALLBACK_INTERFACE_TYPE_NAME = "callback interface";

/** @see https://webidl.spec.whatwg.org/#idl-callback-interface */
export interface CallbackInterfaceType extends TypeBase<object> {
  name: typeof CALLBACK_INTERFACE_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-callback-interface */
export function isCallbackInterfaceType(T: Type): T is CallbackInterfaceType {
  return T.name === CALLBACK_INTERFACE_TYPE_NAME;
}
