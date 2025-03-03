import React from "react";
import { useContextGlobal } from "../gContext/globalContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { state } = useContextGlobal();
  const { token, user } = state;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (user.usuarioRoles !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes;
