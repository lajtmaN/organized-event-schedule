import type { EntryContext } from "@remix-run/server-runtime";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { config } from "./i18n.config";

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
