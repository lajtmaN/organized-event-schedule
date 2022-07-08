import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { hydrate } from "react-dom";
import { I18nextProvider } from "react-i18next";
import { setupTranslations } from "./i18n/setup.client";

setupTranslations().then(() => {
  return hydrate(
    <I18nextProvider i18n={i18next}>
      <RemixBrowser />
    </I18nextProvider>,
    document
  );
});
