import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import BarberBox from "../../components/BarberBox";
import { getBarbers } from "../../api/Barbers";
import Spinner from "../../components/spinner";
import { useTranslation } from "react-i18next";

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

  if (loading) return <Spinner />;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center pt-[80px] px-[20px]">
      <LanguageToggle />
      <h2 className="text-xl font-semibold text-center mb-4">
        {t("SelectYourBarber")}
      </h2>

      <BarberBox>
        {barbers.map((barber) => (
          <div
            key={barber._id}
            onClick={() => {
              setSelectedBarber(barber._id);
              if (fromPage === "login") {
                navigate(
                  `/dashboard?barberId=${barber._id}&name=${barber.name}`,
                );
              } else if (fromPage === "WelcomeScreen") {
                navigate(
                  `/reservation?barberId=${barber._id}&name=${barber.name}`,
                );
              } else if (fromPage === "dashboard") {
                navigate(
                  `/dashboard?barberId=${barber._id}&name=${barber.name}`,
                );
              }
            }}
            className={`card ${selectedBarber === barber._id ? "active" : ""}`}
          >
            <div className="card-info">
              <span className="title text-2xl font-bold">
                {t(`barbers.${barber.name}`)}
              </span>
            </div>
          </div>
        ))}
      </BarberBox>
    </div>
  );
}

export default SelectBarber;
