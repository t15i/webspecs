/** @see https://url.spec.whatwg.org/#concept-url-serializer */
export function urlSerializer(
  url: URL,
  excludeFragment: boolean = false,
): string {
  if (excludeFragment) {
    url.hash = "";
  }
  return url.toString();
}
