import { Routes, Route } from "react-router-dom";
import Reservation from "../pages/reservation";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import WelcomeScreen from "../pages/welcomeScreen";
import ReservationSuccess from "../pages/ReservationSuccess";
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<ReservationSuccess />} />
    </Routes>
  );
}

export default AppRouter;
