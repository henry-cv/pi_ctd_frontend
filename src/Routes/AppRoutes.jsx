/* Aca van tanto rutas grales y privadas */
import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
