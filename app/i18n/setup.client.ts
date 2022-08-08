import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { config } from "./i18n.config";

export const setupTranslations = () => {
  return i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      ...config,
      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
      backend: {
        loadPath: "/i18n/translations/{{lng}}.json",
      },
    });
};
