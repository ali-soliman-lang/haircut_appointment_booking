import type { ReactNode } from "react";
import type { Appointment } from "../../api/TimeTableService/types";

interface TimeTableModalProps {
  selected: Appointment | null;
  onClose: () => void;
  children?: ReactNode;
}

function TimeTableModal({ selected, onClose, children }: TimeTableModalProps) {
  if (!selected) return null;

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
            <h3 className="text-lg font-semibold mb-4">Time Slot Details</h3>

            <p className="mb-2 flex items-start gap-2">
              <span className="font-medium">From:</span> {selected.from_time}
            </p>
            <p className="mb-2 flex items-start gap-2">
              <span className="font-medium">To:</span> {selected.to_time}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TimeTableModal;
