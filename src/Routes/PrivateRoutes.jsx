import React from "react";
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

  // Si no se requiere rol específico pero igual verificamos que sea ADMIN para el dashboard
  if (!adminOnly && user?.usuarioRoles !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes;