import { useNavigate } from "react-router-dom";
import "./index.css";
import Logo from "../../components/Logo";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import LanguageToggle from "../../components/LanguageToggle";

function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center">
      <LanguageToggle />
      <Logo />
      <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4">
        {t("welcome")}
      </h2>
      <button
        onClick={() => navigate("/reservation")}
        type="button"
        className="px-6 py-2 bg-[#0d0d0d] text-white shadow-md hover:bg-white hover:text-black border-2 border-black m-4 transition duration-300 cursor-pointer shadow-black-500/50"
      >
        {t("BookNow")}
      </button>
      <Footer />
    </div>
  );
}

export default WelcomeScreen;
