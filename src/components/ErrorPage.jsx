import React, { useState } from "react";
import "../css/pages/pageError.css";
import NavDash from "./NavDash";
import Footer from "./Footer";
import ButtonGral from "./ButtonGral";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const [isLoggedIn] = useState(false);
  return (
    <>
      <NavDash variant="home" isLoggedIn={isLoggedIn} />
      <section className="page-error">
        <div className="text-info-error">
          <h1>404</h1>
          <p>La página no fue encontrada, ¡lo sentimos!</p>
        </div>
        <Link to={"/"}>
          <ButtonGral text="Volver al inicio" color="blue" icon={<FaHome />} />
        </Link>
      </section>
      <Footer />
    </>
  );
};

export default ErrorPage;
