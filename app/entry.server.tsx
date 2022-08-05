import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext, Headers } from "@remix-run/node";
import { Response } from "@remix-run/node";
import isbot from "isbot";
import { I18nextProvider } from "react-i18next";
import { setupTranslations } from "./i18n/setup.server";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return setupTranslations(request, remixContext).then(
    (i18nInstance) =>
      new Promise((resolve, reject) => {
        let didError = false;

        const { pipe, abort } = renderToPipeableStream(
          <I18nextProvider i18n={i18nInstance}>
            <RemixServer context={remixContext} url={request.url} />
          </I18nextProvider>,
          {
            [callbackName]() {
              let body = new PassThrough();

              responseHeaders.set("Content-Type", "text/html");

              resolve(
                new Response(body, {
                  status: didError ? 500 : responseStatusCode,
                  headers: responseHeaders,
                })
              );
              pipe(body);
            },
            onShellError(err) {
              reject(err);
            },
            onError(error) {
              didError = true;
              console.error(error);
            },
          }
        );
        setTimeout(abort, ABORT_DELAY);
      })
  );
}
