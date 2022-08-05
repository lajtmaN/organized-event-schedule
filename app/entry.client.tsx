import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { hydrateRoot } from "react-dom/client";
import { setupTranslations } from "./i18n/setup.client";

function hydrate() {
  React.startTransition(() => {
    setupTranslations().then(() =>
      hydrateRoot(
        document,
        <React.StrictMode>
          <I18nextProvider i18n={i18next}>
            <RemixBrowser />
          </I18nextProvider>
        </React.StrictMode>
      )
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
