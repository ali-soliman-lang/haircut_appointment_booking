import "./index.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText: string;
}

function TextInput({
  placeholder,
  type,
  label,
  value,
  onChange,
  onBlur,
  helperText,
  ...props
}: TextInputProps) {
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";
  return (
    <>
      <label
        htmlFor={label}
        className={`relative w-full max-w-[280px] mx-auto rounded overflow-hidden block group ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <input
          type={type}
          id={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`peer w-full h-14 pt-7 px-3 text-base font-normal bg-transparent text-black placeholder-transparent border-0 shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-150 ease-in-out focus:outline-none focus:bg-transparent focus:shadow-[inset_0_-2px_0_#000] ${
            isRTL ? "text-right" : "text-left"
          }`}
          {...props}
        />
        <span
          className={`absolute top-5 ${
            isRTL ? "right-3" : "left-3"
          } text-base text-[rgba(0,0,0,0.5)] font-medium transition-all duration-200 transform 
  ${isRTL ? "origin-right" : "origin-left"}
  ${
    value.length > 0
      ? "-translate-y-3 scale-75 text-black"
      : "peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-black"
  }`}
        >
          {placeholder}
        </span>
        <span className="absolute inset-0 bg-[rgba(0,0,0,0.05)] scale-x-0 origin-left transition-transform duration-100 peer-focus:scale-x-100 -z-10"></span>
      </label>
      <p className="mt-1 text-xs text-red-600 px-2 py-1">{helperText}</p>
    </>
  );
}

export default TextInput;
