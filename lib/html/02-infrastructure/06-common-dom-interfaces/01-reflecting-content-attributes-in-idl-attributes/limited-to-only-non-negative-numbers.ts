import type { Type } from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers */
    limitedToOnlyNonNegativeNumbers?: boolean;
  }
}
