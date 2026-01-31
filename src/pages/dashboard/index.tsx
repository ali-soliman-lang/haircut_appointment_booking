import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import AppointmentsTable from "../../components/AppointmentsTable";
import TimeTable from "../../components/TimeTable";
import { toast } from "react-hot-toast";
import { getAppointments } from "../../api/AppointmentsTableService";
import type { reservations } from "../../api/AppointmentsTableService/types";
import LanguageToggle from "../../components/LanguageToggle";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/BackButton";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const prevPath = useRef(location.pathname);
  const [searchParams] = useSearchParams();
  const barberId = searchParams.get("barberId");
  const name = searchParams.get("name");

  const [activeTab, setActiveTab] = useState<"appointments" | "Times" | null>(
    null,
  );
  const [selected, setSelected] = useState<reservations | null>(null);

  const [appointments, setAppointments] = useState<reservations[]>([]);

  // const fetchAppointments = async () => {
  //   try {
  //     const data = await getAppointments({ barber: barberId || undefined });
  //     setAppointments(data);
  //   } catch (error) {
  //     console.error("Failed to fetch appointments", error);
  //   }
  // };

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAppointments({ barber: barberId || undefined });
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  }, [barberId]);

  const handleLogout = useCallback(() => {
    Cookies.remove("isLoggedIn");
    navigate("/login");
    toast.success("Logged out successfully");
  }, [navigate]);

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: "Cancelled" } : item,
      ),
    );
    setSelected(null);
    fetchAppointments();
  };

  const handleAppointmentsChange = (newAppointments: reservations[]) => {
    setAppointments(newAppointments);
  };

  useEffect(() => {
    if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab, fetchAppointments]);

  useEffect(() => {
    const handleBack = () => {
      if (prevPath.current === "/dashboard") {
        navigate("/SelectBarber?from=dashboard");
      }
      prevPath.current = location.pathname;
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate, location.pathname]);
  return (
    <>
      {/* Language button */}
      <LanguageToggle />

      {/* Logout Button */}
      <div className={`flex w-full px-6 py-4 justify-center`}>
        <button
          onClick={handleLogout}
          className=" bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-xl shadow-md transition duration-300 cursor-pointer"
        >
          {t("Logout")}
        </button>
      </div>
      <BackButton to={"/SelectBarber?from=dashboard"} />

      {/* Content Section */}
      <div className="p-6 min-h-screen flex flex-col justify-center items-center text-center relative">
        <h2 className="text-xl font-semibold text-center mb-4 mt-6">
          {name ? t(`barbers.${name}`) : ""}
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-40 h-32 flex flex-col items-center justify-center rounded-2xl text-lg font-semibold shadow-md transition cursor-pointer ${
              activeTab === "appointments"
                ? "bg-blue-500 text-white scale-105"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <span className="text-4xl">📅</span>
            {t("Appointments")}
          </button>

          <button
            onClick={() => setActiveTab("Times")}
            className={`w-40 h-32 flex flex-col items-center justify-center rounded-2xl text-lg font-semibold shadow-md transition cursor-pointer ${
              activeTab === "Times"
                ? "bg-blue-500 text-white scale-105"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <span className="text-4xl">🕒</span>
            {t("Times")}
          </button>
        </div>

        {/* Tables */}
        {activeTab === "appointments" && (
          <AppointmentsTable
            appointments={appointments}
            onSelect={setSelected}
            onAppointmentsChange={handleAppointmentsChange}
          />
        )}
        {activeTab === "Times" && <TimeTable />}

        {/* Popup */}
        <AppointmentModal
          selected={selected}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
}

export default Dashboard;
