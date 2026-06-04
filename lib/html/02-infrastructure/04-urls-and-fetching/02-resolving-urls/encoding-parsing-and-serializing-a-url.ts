import { failure } from "@share";
import { urlSerializer } from "@url";

import { encodingParseURL } from "./encoding-parsing-a-url";

/** @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-and-serializing-a-url */
export function encodingParseAndSerializeURL(
  url: string,
  document: Document,
): string | typeof failure {
  const urlRecord = encodingParseURL(url, document);

  if (urlRecord === failure) {
    return failure;
  }

  return urlSerializer(urlRecord);
}
