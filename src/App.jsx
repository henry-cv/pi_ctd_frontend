import "./css/global/variables.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/Dashboard";
import PanelControl from "./components/PanelControl";
import DashActividades from "./components/DashActividades";
import DashCategorias from "./components/DashCategorias";
import DashAjustes from "./components/DashAjustes";
import AddActivitie from "./components/AddActivitie";
import ActivityDetail from "./pages/ActivityDetail";
import AddCategory from "./components/AddCategory";
import { useContextGlobal } from "./gContext/globalContext";
import AppRoutes from "./Routes/AppRoutes";
import UserProfile from "./pages/UserProfile";
import UserLayout from "./Layouts/UserLayout";

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
            <Route path="categorias/crearcategoria" element={<AddCategory />} />
            <Route path="ajustes" element={<DashAjustes />} />
          </Route>
          <Route path="/" element={<UserLayout/>} > 
          <Route path="/actividad/:id" element={<ActivityDetail />} />
          <Route path="/perfil" element={<UserProfile />} />
          </Route>

        </Routes>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
