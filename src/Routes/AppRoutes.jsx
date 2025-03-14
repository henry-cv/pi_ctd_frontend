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
import PrivateRoutes from "./PrivateRoutes";
import ErrorPage from "../components/ErrorPage";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute";
import EditActivitie from "../components/EditActivitie";
import DashCharacteristics from "../components/DashCharacteristics";
import AddCharacteristic from "../components/AddCharacteristic";
import FilterProducts from "../pages/FilterProducts";
import PolicyPage from "../components/PolicyPage";
import Terms from "../pages/Terms";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/" element={<UserLayout />}>
        <Route path="/actividades" element={<FilterProducts />} />
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
        <Route path="caracteristicas" element={<DashCharacteristics />} />
        <Route path="caracteristicas/crearcaracteristica" element={<AddCharacteristic />} />

      </Route>

      {/* Otras rutas */}
      <Route path="/" element={<UserLayout />}>
        <Route path="/actividad/:id" element={<ActivityDetail />} />
        <Route path="/terminosycondiciones" element={<Terms />} />
        <Route path="/perfil" element={<UserProfile />} />

      </Route>

      <Route path="*" element={<ErrorPage />} />
      {/* Ruta para políticas de uso */}
      <Route path="/politicasdeuso" element={<PolicyPage />} />
    </Routes>
  );
};

export default AppRoutes;