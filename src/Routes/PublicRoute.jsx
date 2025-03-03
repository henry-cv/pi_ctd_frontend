import React from "react";
import { Navigate } from "react-router-dom";
import { useContextGlobal } from "../gContext/globalContext";

const PublicRoute = ({ children }) => {
  const { state } = useContextGlobal();
  const { token } = state;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
