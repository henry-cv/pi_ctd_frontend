/*Ene ste archivo solo manejará las rutass de autenticación(Login y Register) */

import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/entrar" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      {/* Seguido va el componente de register */}
    </Routes>
  );
};

export default AuthRoutes;
