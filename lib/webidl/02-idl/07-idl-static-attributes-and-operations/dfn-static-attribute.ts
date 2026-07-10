import type { Attribute } from "@webidl";

export function isStaticAttribute(attr: Attribute): boolean {
  return attr.keywords.has("static");
}
