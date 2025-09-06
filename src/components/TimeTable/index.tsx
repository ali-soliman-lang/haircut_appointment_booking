import { useState, useEffect, useRef } from "react";
import {
  getTimeTable,
  createTimeTable,
  editTimeTable,
  deleteTimeTable,
} from "../../api/TimeTableService/index";
import type { Appointment } from "../../api/TimeTableService/types";
import { toast } from "react-hot-toast";
import TimeTableModal from "../TimeTableModal";

function TimeTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTimeTable();
      setAppointments(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
        <span className="ml-3 text-slate-600">Loading...</span>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-slate-800">👤 Times</h2>
      <div className="flex justify-start w-[65%]">
        <button
          onClick={() => {
            setIsAdding(true);
            setSelected({
              _id: "",
              from_time: "",
              to_time: "",
            });
          }}
          className="bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer mb-5"
        >
          add new time
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200 w-[65%]">
        <table className="w-full border-collapse bg-white  text-sm text-slate-600 text-center">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 font-medium">times</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[...appointments]
              .sort((a, b) => {
                const isAM_A = a.from_time.toLowerCase().includes("am");
                const isAM_B = b.from_time.toLowerCase().includes("am");

                if (isAM_A && !isAM_B) return 1;
                if (!isAM_A && isAM_B) return -1;

                return a.from_time.localeCompare(b.from_time);
              })
              .map((time) => (
                <tr key={time._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{time.from_time}</td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => {
                        setSelected(time);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
                    >
                      Edit
                    </span>
                    <span
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Are you sure you want to delete this appointment?"
                          )
                        )
                          return;
                        try {
                          await deleteTimeTable(time._id || "");
                          toast.success("Appointment deleted successfully");
                          fetchData();
                        } catch {
                          toast.error("Failed to delete appointment");
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer ml-2"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {(selected || isAdding) && (
        <TimeTableModal
          selected={selected}
          onClose={() => {
            setSelected(null);
            setIsAdding(false);
          }}
        >
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">
              {isAdding ? "➕ Add Time" : "✏️ Edit Time"}
            </h3>
            <div className="flex flex-col">
              <input
                type="text"
                defaultValue={isAdding ? "" : selected?.from_time}
                ref={inputRef}
                className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelected(null);
                  setIsAdding(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const timeValue = inputRef.current?.value;
                  if (!timeValue) {
                    toast.error("Time cannot be empty");
                    return;
                  }
                  try {
                    if (isAdding) {
                      await createTimeTable({
                        from_time: timeValue,
                        to_time: timeValue,
                      });
                      toast.success("New time added successfully");
                    } else {
                      await editTimeTable(selected?._id || "", {
                        from_time: timeValue,
                      });
                      toast.success("Update completed successfully");
                    }
                    fetchData();
                    setSelected(null);
                    setIsAdding(false);
                  } catch {
                    toast.error("Failed to save. Please try again.");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </TimeTableModal>
      )}
    </>
  );
}

export default TimeTable;
