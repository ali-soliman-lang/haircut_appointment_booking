// import { useState, useRef, useEffect } from "react";
// import type { SelectOption } from "../../types/types";

// type Props = {
//   name: string;
//   placeholder: string;
//   options: SelectOption[];
//   value: string;
//   onChange: (name: string, value: string) => void;
//   error?: string;
// };

// function Dropdown({
//   name,
//   placeholder,
//   options,
//   value,
//   onChange,
//   error,
// }: Props) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const selected = options.find((o) => o.value === value);

//   return (
//     <div className="relative w-full" ref={ref}>
//       {/* Trigger */}
//       <div
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex justify-between items-center h-12 px-3 border rounded-lg cursor-pointer bg-white"
//       >
//         <span className={value ? "text-black" : "text-gray-400"}>
//           {selected ? selected.label : placeholder}
//         </span>

//         <span className={`transition ${open ? "rotate-180" : ""}`}>▼</span>
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <ul className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
//           {options.length === 0 ? (
//             <li className="p-3 text-sm text-gray-400 text-center">
//               No options
//             </li>
//           ) : (
//             options.map((option) => (
//               <li
//                 key={option.value}
//                 onClick={() => {
//                   onChange(name, option.value);
//                   setOpen(false);
//                 }}
//                 className="p-3 hover:bg-gray-100 cursor-pointer"
//               >
//                 {option.label}
//               </li>
//             ))
//           )}
//         </ul>
//       )}

//       {/* Error */}
//       {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// }

// export default Dropdown;

import { useState, useRef, useEffect } from "react";
import type { SelectOption } from "../../types/types";

type Props = {
  name: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
};

function Dropdown({
  name,
  placeholder,
  options,
  value,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isRTL = document.documentElement.getAttribute("dir") === "rtl";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full max-w-[280px] mx-auto" ref={ref}>
      {/* MAIN BOX (same exact design) */}
      <div
        onClick={() => setOpen(!open)}
        className="peer flex items-start justify-between h-14 pt-7 px-3 text-base font-normal bg-transparent text-black border-0 shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-150 ease-in-out cursor-pointer hover:shadow-[inset_0_-2px_0_#000]"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {selected?.label}
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

      {/* FLOATING LABEL (same exact design) */}
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

      {/* DROPDOWN */}
      {open && (
        <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
          {options.length === 0 ? (
            <li className="px-3 py-2 text-center text-gray-400 text-sm">
              No options
            </li>
          ) : (
            options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(name, option.value);
                  setOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}

      {/* ERROR */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Dropdown;
