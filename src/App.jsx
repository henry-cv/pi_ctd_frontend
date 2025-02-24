import "./css/variables.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import PanelControl from "./components/PanelControl";
import DashActividades from "./components/DashActividades";
import DashCategorias from "./components/DashCategorias";
import DashAjustes from "./components/DashAjustes";
import AddActivitie from "./components/AddActivitie";
import ActivityDetail from "./pages/ActivityDetail";
import { useContextGlobal } from "./gContext/globalContext";

function App() {
  const { state } = useContextGlobal();
  return (
    <BrowserRouter>
      <div className={`bg-white min-h-screen  ${state.theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/administrador" element={<Dashboard />}>
            <Route index element={<Navigate to="panel" replace />} />
            <Route path="panel" element={<PanelControl />} />
            <Route path="actividades" element={<DashActividades />} />
            <Route
              path="actividades/crearactividad"
              element={<AddActivitie />}
            />
            <Route path="categorias" element={<DashCategorias />} />
            <Route path="ajustes" element={<DashAjustes />} />
          </Route>
          <Route path="/actividad/:id" element={<ActivityDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
