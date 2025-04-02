import { useContextGlobal } from "../gContext/globalContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children, adminOnly = false }) => {
  const { state } = useContextGlobal();
  const { token, user } = state;

  // Si no hay token, redirigir al inicio
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere rol ADMIN y el usuario no lo tiene, redirigir al inicio
  if (adminOnly && user?.usuarioRoles !== "ADMIN") {
    return <Navigate to="/administrador/ajustes" replace />;
  }

  // No dejaba reservar a los usuarios normal, si se necesita ver de hacerlo de otro modor
  // if (!adminOnly && user?.usuarioRoles !== "ADMIN") {
  //   return <Navigate to="/" replace />;
  // }
  const isDashboardRoute = window.location.pathname.startsWith('/administrador');
  if (isDashboardRoute && user?.usuarioRoles !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes;