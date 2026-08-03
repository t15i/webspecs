import { setFunctionLength, setFunctionName } from "@ecma";
import type { PropertyKey } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createbuiltinfunction */
export interface CreateBuiltinFunctionOptions {
  construct: boolean;
  proto?: object | null;
  prefix?: string;
}

/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-createbuiltinfunction */
export function createBuiltinFunction<T extends CallableFunction>(
  behaviour: T,
  length: number,
  name: PropertyKey,
  options: CreateBuiltinFunctionOptions,
): T {
  // NOTE (realm): the `realm` parameter is omitted; this implementation is bound to the
  // single ambient realm and emulates no `[[Realm]]` internal slot.

  // NOTE (realm): realm.[[Intrinsics]].[[%Function.prototype%]] replaced with
  // single ambient realm Function.prototype
  let proto = options.proto;
  if (proto === undefined) {
    proto = Function.prototype;
  }

  // NOTE (async): the `async` parameter and the `[[Async]]` internal slot it
  // feeds are not observable from the JS runtime, so both are omitted.

  // NOTE (additionalInternalSlotsList): internal slots cannot be modelled, so
  // the parameter and the internal slots list are omitted.

  let func: CallableFunction;
  if (options.construct) {
    // A constructable built-in function has [[Construct]] internal method
    // and `.prototype`
    func = function (this: unknown, ...args: unknown[]): unknown {
      if (new.target === undefined) {
        return Reflect.apply(behaviour, this, args);
      }
      return Reflect.construct(behaviour, args, new.target);
    };
  } else {
    // A concise method has neither a [[Construct]] internal method nor an own
    // `.prototype`
    func = {
      fn(this: unknown, ...args: unknown[]): unknown {
        return Reflect.apply(behaviour, this, args);
      },
    }["fn"];
  }

  // NOTE (Async): ignoring "Set func.[[Async]] to async."

  Object.setPrototypeOf(func, proto);

  // NOTE (Extensible): [[Extensible]] is true by design

  // NOTE (Realm): [[Realm]] is ambient by design

  // NOTE (InitialName): "Set func.[[InitialName]] to null" cannot be
  // implemented in JS runtime

  setFunctionLength(func, length);

  if (options.prefix === undefined) {
    setFunctionName(func, name);
  } else {
    setFunctionName(func, name, options.prefix);
  }

  // The wrapper presents the same call signature as `behaviour`, so it is typed
  // as `T` for callers even though it is a fresh function object.
  return func as T;
}
