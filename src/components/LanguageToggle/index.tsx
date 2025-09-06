import { useEffect, useState } from "react";
import i18n from "../../i18n";

function LanguageToggle() {
  if (!localStorage.getItem("lang")) {
    localStorage.setItem("lang", "ar");
  }
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem("lang") || "ar"
  );

  useEffect(() => {
    i18n.changeLanguage(currentLang);
    document.documentElement.setAttribute(
      "dir",
      currentLang === "ar" ? "rtl" : "ltr"
    );
  }, [currentLang]);

  const toggleLanguage = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";
    setCurrentLang(newLang);
    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute(
      "dir",
      newLang === "ar" ? "rtl" : "ltr"
    );
  };

  return (
    <div className="absolute top-4 left-4 flex gap-2">
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        {currentLang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
}

export default LanguageToggle;
