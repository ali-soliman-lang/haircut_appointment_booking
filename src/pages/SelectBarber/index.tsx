import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import BarberBox from "../../components/BarberBox";
import { getBarbers } from "../../api/Barbers";
import Spinner from "../../components/spinner";
import { useTranslation } from "react-i18next";
import { FaLongArrowAltDown } from "react-icons/fa";

interface Barber {
  _id: string;
  name: string;
  __v: number;
}

function SelectBarber() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArrow, setShowArrow] = useState(true);

  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(data);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center pt-[80px] px-[20px] overflow-x-hidden">
      <LanguageToggle />
      <h2 className="text-xl font-semibold text-center mb-4">
        {t("SelectYourBarber")}
      </h2>
      <div className="relative">
        <BarberBox>
          {barbers.map((barber) => (
            <div
              key={barber._id}
              onClick={() => {
                setSelectedBarber(barber._id);

                const base = `?barberId=${barber._id}&name=${barber.name}`;

                if (fromPage === "login" || fromPage === "dashboard") {
                  navigate(`/dashboard${base}`);
                } else {
                  navigate(`/reservation${base}`);
                }
              }}
              className={`card ${selectedBarber === barber._id ? "active" : ""}`}
            >
              <img
                src="/images/razor-img.png"
                alt="barber"
                className="card-image"
              />

              <div className="overlay">
                <span
                  className={`title font-bold ${barber.name?.toLowerCase() === "rezk" ? "text-[1.5rem]" : "text-[1.1rem]"}`}
                >
                  {t(`barbers.${barber.name}`)}
                </span>
              </div>
            </div>
          ))}
        </BarberBox>
        {showArrow && (
          <div
            onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 text-xl animate-bounce block md:hidden"
          >
            <FaLongArrowAltDown />
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectBarber;
