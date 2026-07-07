import type { Type } from "@webidl";

export const CALLBACK_INTERFACE_TYPE_NAME = "callback interface";

/** @see https://webidl.spec.whatwg.org/#idl-callback-interface */
export interface CallbackInterfaceType extends Type<object> {
  name: typeof CALLBACK_INTERFACE_TYPE_NAME;
}

export function isCallbackInterfaceType(T: Type): T is CallbackInterfaceType {
  return T.name === CALLBACK_INTERFACE_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [CALLBACK_INTERFACE_TYPE_NAME]: CallbackInterfaceType;
  }
}
