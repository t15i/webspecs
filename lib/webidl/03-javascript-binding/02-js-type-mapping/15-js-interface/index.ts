import {
  type InterfaceType,
  isPlatformObject,
  PrimaryInterface,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-interface */
export function asInterfaceType<T>(this: InterfaceType<T>, v: unknown): T {
  if (v instanceof this.T) {
    return v;
  }

  const proto = this.T.prototype;
  const name = isPlatformObject(proto)
    ? proto[PrimaryInterface].identifier
    : this.T.name;

  throw TypeError(`The provided value cannot be converted to '${name}'`);
}
