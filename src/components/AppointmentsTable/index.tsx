import { useEffect, useState } from "react";
import type { reservations } from "../../api/AppointmentsTableService/types";
import { getTimeTable } from "../../api/TimeTableService";
import type { Appointment } from "../../api/TimeTableService/types";
import { toast } from "react-hot-toast";
import { cancelAppointment } from "../../api/AppointmentsTableService";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    const getTimeDropdown = async () => {
      const dataTimeNew = await getTimeTable();
      const bookedTimes = appointments.map((item) => item?.time?.from_time);
      const filteredTimes = dataTimeNew.filter(
        (time) => !bookedTimes.includes(time.from_time)
      );
      setTimeAvailable(filteredTimes);
    };
    getTimeDropdown();

    return () => clearTimeout(timer);
  }, [appointments]);

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

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        📅 Booked Appointments
      </h2>
      <div className="flex justify-start w-[65%]">
        <button
          onClick={() => {
            handleDeleteAll();
          }}
          className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer mb-5"
        >
          Delete all Appointments
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200 w-[65%]">
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
            <span className="ml-3 text-slate-600">Loading...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No appointments found.
          </div>
        ) : (
          <>
            <table className="w-full border-collapse bg-white text-left text-sm text-slate-600">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-center">
                    {" "}
                    Booked Appointments
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[...appointments]
                  .sort((a, b) => {
                    const isAM_A = a?.time?.from_time
                      .toLowerCase()
                      .includes("am");
                    const isAM_B = b?.time?.from_time
                      .toLowerCase()
                      .includes("am");

                    if (isAM_A && !isAM_B) return 1;
                    if (!isAM_A && isAM_B) return -1;

                    return a?.time?.from_time.localeCompare(b?.time?.from_time);
                  })
                  .map((item) => {
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => onSelect(item)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <div className="flex flex-col items-center">
                            <span>{item?.name}</span>
                            <span className="text-slate-600">
                              {item?.mobile}
                            </span>
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
                    Appointments available
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[...timeAvailable]
                  .sort((a, b) => {
                    const isAM_A = a.from_time.toLowerCase().includes("am");
                    const isAM_B = b.from_time.toLowerCase().includes("am");

                    if (isAM_A && !isAM_B) return 1;
                    if (!isAM_A && isAM_B) return -1;

                    return a.from_time.localeCompare(b.from_time);
                  })
                  .map((item) => {
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
