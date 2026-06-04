/** @see https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor */
export function isDataDescriptor(desc: PropertyDescriptor): boolean {
  if ("value" in desc) {
    return true;
  }

  if ("writable" in desc) {
    return true;
  }

  return false;
}
