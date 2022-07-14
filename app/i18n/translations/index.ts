import DA from "./da.json";

export type TranslationKeys = keyof typeof DA;

export const TranslationResources = {
  da: {
    translation: DA,
  },
} as const;

declare module "react-i18next" {
  type MyDefaultResources = typeof TranslationResources.da;
  interface Resources extends MyDefaultResources {}
}
