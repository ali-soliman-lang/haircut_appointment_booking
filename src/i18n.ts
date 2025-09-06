import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { Resource } from "i18next";
import locales from "./locales/locales.json";

if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", "ar");
}

const currentLang = localStorage.getItem("lang") || "ar";

i18n
  .use(initReactI18next) // Bind react-i18next to i18n
  .init({
    resources: locales as Resource,
    lng: currentLang,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
