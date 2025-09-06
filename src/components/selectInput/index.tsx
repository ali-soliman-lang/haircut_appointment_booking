import { useState, useEffect, useRef } from "react";
import type { Appointment } from "../../api/TimeTableService/types";

import "./index.css";

function SelectInput({
  name,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  placeholder: string;
  options: Appointment[];
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[280px] mx-auto" ref={dropdownRef}>
      {/* Main box */}
      <div
        onClick={() => setOpen(!open)}
        className="peer flex items-start justify-between h-14 pt-7 px-3 text-base font-normal bg-transparent text-black placeholder-transparent border-0 shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-150 ease-in-out cursor-pointer hover:shadow-[inset_0_-2px_0_#000]"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {options.find((option) => option._id === value)?.from_time}
        </span>
        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.1}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </div>

      {/* Floating label */}
      <span
        className={`absolute top-5 ${
          isRTL ? "right-3" : "left-3"
        } text-base text-[rgba(0,0,0,0.5)] font-medium transition-all duration-200 transform 
  ${isRTL ? "origin-right" : "origin-left"}
  ${
    value
      ? "-translate-y-3 scale-75 text-black"
      : "peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-black"
  }`}
        onClick={() => setOpen(!open)}
      >
        {placeholder}
      </span>

      {/* Dropdown menu */}
      {open && (
        <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
          {open && (
            <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
              {options.length === 0 ? (
                <li className="px-3 py-2 text-center text-gray-400 text-sm">
                  Appointments are booked.
                </li>
              ) : (
                [...options]
                  .sort((a, b) => {
                    const isAM_A = a.from_time.toLowerCase().includes("am");
                    const isAM_B = b.from_time.toLowerCase().includes("am");

                    if (isAM_A && !isAM_B) return 1;
                    if (!isAM_A && isAM_B) return -1;

                    return a.from_time.localeCompare(b.from_time);
                  })
                  .map((option) => (
                    <li
                      key={option._id}
                      onClick={() => {
                        onChange(name, option._id || ""); // update Formik
                        setOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {option.from_time}
                    </li>
                  ))
              )}
            </ul>
          )}
        </ul>
      )}

      {/* Error */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default SelectInput;
