// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const isLoggedIn = Cookies.get("isLoggedIn");
//   return isLoggedIn === "true" ? children : <Navigate to="/login" />;
// }

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = Cookies.get("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
