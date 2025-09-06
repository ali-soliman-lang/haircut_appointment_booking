import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTimeTable } from "../../api/TimeTableService";
import type { Appointment } from "../../api/TimeTableService/types";
import LanguageToggle from "../../components/LanguageToggle";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner";

function ReservationSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<{
    name: string;
    phoneNumber: string;
    time: string;
  } | null>(null);
  const [timeData, setTimeData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const getTimeDropdown = async () => {
    const dataTimeNew = await getTimeTable();
    setTimeData(dataTimeNew);
  };

  useEffect(() => {
    const fetchData = async () => {
      const savedReservation = localStorage.getItem("reservation");
      if (savedReservation) {
        setReservation(JSON.parse(savedReservation));
      } else {
        navigate("/");
        return;
      }

      await getTimeDropdown();
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (!reservation) return null;

  const selectedTime = timeData?.find((time) => time?._id === reservation.time);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="p-4 self-end mb-9 sm:mb-12">
        <LanguageToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            {t("ReservationsDone")}
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-left">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">{t("Name")} :</span>
              <span>{reservation.name}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">
                {t("PhoneNumber")} :
              </span>
              <span>{reservation.phoneNumber}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">{t("Time")} :</span>
              <span>{selectedTime?.from_time}</span>
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("reservation");
              navigate("/");
            }}
            className="mt-8 w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition duration-300"
          >
            {t("Finish")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReservationSuccess;
