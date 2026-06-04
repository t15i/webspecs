import { failure } from "@share";
import { urlParser } from "@url";

/** @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-a-url */
export function encodingParseURL(
  url: string,
  document: Document,
): URL | typeof failure {
  const encoding = document.characterSet;
  const baseURL = new URL(document.baseURI);

  return urlParser(url, baseURL, encoding);
}
