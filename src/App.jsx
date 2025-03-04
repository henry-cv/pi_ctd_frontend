import "./css/global/variables.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContextGlobal } from "./gContext/globalContext";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const { state } = useContextGlobal();
  return (
    <BrowserRouter>
      <div className={`bg-white min-h-screen ${state.theme}`}>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
