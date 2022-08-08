import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { setupTranslations } from "./i18n/setup.server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const translations = await setupTranslations(request, remixContext);

  const markup = renderToString(
    <I18nextProvider i18n={translations}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
