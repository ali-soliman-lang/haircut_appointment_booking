import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useDisableBack() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      navigate("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
}

export default useDisableBack;
