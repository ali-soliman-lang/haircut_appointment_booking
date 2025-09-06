import AppRouter from "./router/AppRouter";
import "./App.css";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <AppRouter />
    </>
  );
}

export default App;
