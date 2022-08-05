import type { EntryContext } from "@remix-run/server-runtime";
import { createInstance } from "i18next";
import { resolve } from "node:path";
import { initReactI18next } from "react-i18next";
import { RemixI18Next } from "remix-i18next";
import { config } from "./i18n.config";

let i18next = new RemixI18Next({
  detection: {
    supportedLanguages: config.supportedLngs,
    fallbackLanguage: config.fallbackLng,
  },
  i18next: {
    ...config,
    backend: {
      loadPath: resolve("./i18n/translations/{{lng}}.json"),
    },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here

  // backend: Backend,
});
export const setupTranslations = async (
  request: Request,
  context: EntryContext
) => {
  let instance = createInstance();

  // // Then we could detect locale from the request
  // let lng = await i18next.getLocale(request);
  // // And here we detect what namespaces the routes about to render want to use
  // let ns = i18next.getRouteNamespaces(context);

  await instance.use(initReactI18next).init(config);
  return instance;
};

export default i18next;
