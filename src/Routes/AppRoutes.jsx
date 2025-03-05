import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Dashboard from "../pages/Dashboard";
import PanelControl from "../components/PanelControl";
import DashActividades from "../components/DashActividades";
import DashCategorias from "../components/DashCategorias";
import DashAjustes from "../components/DashAjustes";
import AsignarRol from "../components/AsignarRol";
import AddActivitie from "../components/AddActivitie";
import ActivityDetail from "../pages/ActivityDetail";
import AddCategory from "../components/AddCategory";
import UserProfile from "../pages/UserProfile";
import UserLayout from "../Layouts/UserLayout";
import FormBasis from "../components/FormBasis";
import PrivateRoutes from "./PrivateRoutes";
import ErrorPage from "../components/ErrorPage";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute";
import EditActivitie from "../components/EditActivitie";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/" element={<UserLayout />}>
        <Route path="/actividad/:id" element={<ActivityDetail />} />
      </Route>
      {/* Rutas de autenticación (públicas) */}
      <Route
        path="/entrar"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Rutas privadas */}
      <Route
        path="/administrador"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      >
        <Route index element={<Navigate to="panel" replace />} />
        <Route path="panel" element={<PanelControl />} />
        <Route path="actividades" element={<DashActividades />} />
        <Route path="actividades/crearactividad" element={<AddActivitie />} />
        <Route
          path="/administrador/actividades/editarActividad"
          element={<EditActivitie />}
        />
        <Route path="categorias" element={<DashCategorias />} />
        <Route path="categorias/crearcategoria" element={<AddCategory />} />
        <Route path="ajustes" element={<DashAjustes />} />
        <Route 
          path="ajustes/asignar-rol" 
          element={
            <PrivateRoutes adminOnly={true}>
              <AsignarRol />
            </PrivateRoutes>
          } 
        />
      </Route>

      {/* Otras rutas */}
      <Route path="/" element={<UserLayout />}>
        <Route path="/actividad/:id" element={<ActivityDetail />} />
        <Route path="/perfil" element={<UserProfile />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;