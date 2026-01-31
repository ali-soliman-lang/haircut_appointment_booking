import { useNavigate } from "react-router-dom";

interface BackButtonState {
  from?: string;
}

interface BackButtonProps {
  to: string;
  state?: BackButtonState;
}

function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleGo = () => {
    navigate(to);
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={handleGo}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}

export default BackButton;
