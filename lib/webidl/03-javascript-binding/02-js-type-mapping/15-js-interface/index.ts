import { type InterfaceType } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-interface */
export function asInterfaceType<T>(this: InterfaceType<T>, v: unknown): T {
  if (v instanceof this.T) {
    return v;
  }

  throw TypeError(`The provided value cannot be converted to '${this.T.name}'`);
}
