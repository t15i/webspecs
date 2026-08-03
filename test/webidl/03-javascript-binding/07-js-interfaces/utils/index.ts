import { Exposed, Unforgeables, type Interface } from "lib/webidl";

/** Builds a synthetic interface for the interface-object tests. */
export function makeInterface(overrides: Partial<Interface> = {}): Interface {
  return {
    identifier: "Example",
    extendedAttributes: { [Exposed]: "*" },
    inherit: null,
    staticMembers: {},
    members: {},
    ...overrides,
  };
}

/**
 * Reads the emulated `[[Unforgeables]]` slot of an interface object by the
 * exported {@link Unforgeables} symbol, so the lookup is by identity rather than
 * by matching a description string.
 */
export function getUnforgeables(interfaceObject: object): object {
  return (interfaceObject as { [Unforgeables]: object })[Unforgeables];
}
