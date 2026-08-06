import { Exposed, type Interface } from "lib/webidl";

/** Builds a synthetic interface for the interface tests. */
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
