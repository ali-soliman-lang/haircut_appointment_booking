import type { ReactNode } from "react";
import type { reservations } from "../../api/AppointmentsTableService/types";
import { cancelAppointment } from "../../api/AppointmentsTableService";
import { toast } from "react-hot-toast";

interface AppointmentModalProps {
  selected: reservations | null;
  onClose: () => void;
  onCancel: (id: string) => void;
  children?: ReactNode;
}

function AppointmentModal({
  selected,
  onClose,
  onCancel,
  children,
}: AppointmentModalProps) {
  if (!selected) return null;

  const deleteAppointment = async () => {
    try {
      await cancelAppointment(selected._id);
      onCancel(selected._id);
      onClose();
      toast.success(`Deleted appointment for ${selected.name} successfully`);
    } catch {
      toast.error(`Failed to delete appointment for ${selected.name}`);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-96 p-6"
      >
        {children ? (
          children
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>

            <p className="mb-2 flex items-start gap-2">
              <span className="font-medium">Name:</span> {selected?.name}
            </p>

            <p className="mb-2 flex items-center justify-between">
              <span>
                <span className="font-medium">Phone:</span> {selected?.mobile}
              </span>
              <a
                href={`tel:${selected?.mobile}`}
                className="bg-green-500 text-white px-2 py-1 rounded-md cursor-pointer"
              >
                Call
              </a>
            </p>

            <p className="mb-4 flex items-start gap-2">
              <span className="font-medium">Time: </span>{" "}
              {selected?.time?.from_time}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onCancel(selected._id);
                  deleteAppointment();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Remove Reservation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AppointmentModal;
