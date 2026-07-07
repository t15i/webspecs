import { modulo, toNumber } from "@ecma";
import {
  Clamp,
  EnforceRange,
  isAnnotatedWithExtAttribute,
  type Type,
} from "@webidl";

import { integerPart } from "./abstract-opdef-integerpart";

function roundHalfToEven(x: number): number {
  const floor = Math.floor(x);
  const fraction = x - floor;

  let result: number;
  if (fraction < 0.5) {
    result = floor;
  } else if (fraction > 0.5) {
    result = floor + 1;
  } else {
    result = floor % 2 === 0 ? floor : floor + 1;
  }

  return result;
}

/** @see https://webidl.spec.whatwg.org/#abstract-opdef-converttoint */
export function convertToInt(
  this: Type | void,
  v: unknown,
  bitLength: number,
  signedness: "signed" | "unsigned",
): number {
  let lowerBound: number;
  let upperBound: number;
  if (bitLength === 64) {
    upperBound = Math.pow(2, 53) - 1;
    lowerBound = signedness === "unsigned" ? 0 : -Math.pow(2, 53) + 1;
  } else if (signedness === "unsigned") {
    lowerBound = 0;
    upperBound = Math.pow(2, bitLength) - 1;
  } else {
    lowerBound = -Math.pow(2, bitLength - 1);
    upperBound = Math.pow(2, bitLength - 1) - 1;
  }

  let x = toNumber(v);

  if (Object.is(x, -0)) {
    x = 0;
  }

  if (isAnnotatedWithExtAttribute(this, EnforceRange)) {
    if (!Number.isFinite(x)) {
      throw TypeError(
        `[EnforceRange] conversion requires a finite number, got ${x}`,
      );
    }

    x = integerPart(x);

    if (x < lowerBound || x > upperBound) {
      throw TypeError(
        `[EnforceRange] value ${x} is outside the [${lowerBound}, ${upperBound}] range for a ${bitLength}-bit ${signedness} integer`,
      );
    }

    return x;
  }

  if (!Number.isNaN(x) && isAnnotatedWithExtAttribute(this, Clamp)) {
    x = Math.min(Math.max(x, lowerBound), upperBound);
    return roundHalfToEven(x);
  }

  if (!Number.isFinite(x) || Object.is(x, +0)) {
    return 0;
  }

  x = modulo(integerPart(x), Math.pow(2, bitLength));

  if (signedness === "signed" && x >= Math.pow(2, bitLength - 1)) {
    return x - Math.pow(2, bitLength);
  }

  return x;
}
