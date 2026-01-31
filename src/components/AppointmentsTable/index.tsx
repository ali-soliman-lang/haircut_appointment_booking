import { useEffect, useMemo, useState } from "react";
import type { reservations } from "../../api/AppointmentsTableService/types";
import { getTimeTable } from "../../api/TimeTableService";
import type { Appointment } from "../../api/TimeTableService/types";
import { toast } from "react-hot-toast";
import { cancelAppointment } from "../../api/AppointmentsTableService";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface Props {
  appointments: reservations[];
  onSelect: (item: reservations | null) => void;
  onAppointmentsChange: (appointments: reservations[]) => void;
}

function AppointmentsTable({
  appointments,
  onSelect,
  onAppointmentsChange,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [timeAvailable, setTimeAvailable] = useState<Appointment[]>([]);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const barberId = searchParams.get("barberId");
  // useEffect(() => {
  //   const getTimeDropdown = async () => {
  //     try {
  //       setLoading(true);
  //       const dataTimeNew = await getTimeTable(barberId || "");
  //       const bookedTimes = appointments.map((item) => item?.time?.from_time);
  //       const filteredTimes = dataTimeNew.filter(
  //         (time) => !bookedTimes.includes(time.from_time),
  //       );
  //       setTimeAvailable(filteredTimes);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getTimeDropdown();
  // }, [appointments, barberId]);
  useEffect(() => {
    const getTimeDropdown = async () => {
      try {
        setLoading(true);
        const dataTimeNew = await getTimeTable(barberId || "");
        setTimeAvailable(dataTimeNew);
      } finally {
        setLoading(false);
      }
    };
    getTimeDropdown();
  }, [barberId]);

  const handleDeleteAll = async () => {
    const ids = appointments.map((item) => item._id);
    setLoading(true);
    try {
      await Promise.all(ids.map((id) => cancelAppointment(id)));
      onAppointmentsChange([]);
      onSelect(null);
      toast.success("delete all appointments successfully");
    } catch {
      toast.error("Delete all appointments failed");
    } finally {
      setLoading(false);
    }
  };
  const timeToMinutes = (time?: string) => {
    if (!time) return 0;

    const [t, period] = time.split(" ");

    const [h, m] = t.split(":");

    let hours = Number(h);
    const minutes = Number(m);

    if (period.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }

    if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      return (
        timeToMinutes(a?.time?.from_time) - timeToMinutes(b?.time?.from_time)
      );
    });
  }, [appointments]);
  // const sortedTimeAvailable = useMemo(() => {
  //   return [...timeAvailable].sort((a, b) => {
  //     return timeToMinutes(a?.from_time) - timeToMinutes(b?.from_time);
  //   });
  // }, [timeAvailable]);
  const sortedTimeAvailable = useMemo(() => {
    const bookedTimes = appointments.map((item) => item?.time?.from_time);

    const filtered = timeAvailable.filter(
      (time) => !bookedTimes.includes(time.from_time),
    );

    return [...filtered].sort((a, b) => {
      return timeToMinutes(a?.from_time) - timeToMinutes(b?.from_time);
    });
  }, [timeAvailable, appointments]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        📅 {t("BookedAppointments")}
      </h2>
      <div className="flex justify-start w-[65%]">
        <button
          onClick={() => {
            handleDeleteAll();
          }}
          className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer mb-5"
        >
          {t("DeleteAllAppointments")}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200 w-[65%]">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
            <span className="ml-3 text-slate-600">{t("LoadingDashboard")}</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            {t("NoAppointmentsFound")}
          </div>
        ) : (
          <>
            <table className="w-full border-collapse bg-white text-left text-sm text-slate-600">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("BookedAppointments")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedAppointments.map((item) => {
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => onSelect(item)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex flex-col items-center">
                          <span>{item?.name}</span>
                          <span className="text-slate-600">{item?.mobile}</span>
                          <span className="text-slate-600">
                            {item?.time?.from_time}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <table className="w-full border-collapse bg-white text-left text-sm text-slate-600">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("AvailableAppointments")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedTimeAvailable.map((item) => {
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex flex-col items-center">
                          <span>{item.name}</span>
                          <span className="text-slate-600">
                            {item.from_time}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default AppointmentsTable;
