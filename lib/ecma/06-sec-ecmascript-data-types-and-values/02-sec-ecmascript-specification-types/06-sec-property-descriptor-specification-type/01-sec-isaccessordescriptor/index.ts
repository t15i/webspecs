/** @see https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isaccessordescriptor */
export function isAccessorDescriptor(desc: PropertyDescriptor): boolean {
  if ("set" in desc) {
    return true;
  }

  if ("get" in desc) {
    return true;
  }

  return false;
}
