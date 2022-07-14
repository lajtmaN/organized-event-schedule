import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { TranslationResources } from "./translations";

export const setupTranslations = () => {
  return i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: TranslationResources,
      lng: "da", // if you're using a language detector, do not define the lng option
      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
};
