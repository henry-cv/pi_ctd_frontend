import { useState, useEffect } from "react";
import { useContextGlobal } from "../gContext/globalContext";

const LogoImg = () => {
   const { state } = useContextGlobal();
   console.log(state.theme);
   

  return (
    <div className="logo-socialIcons">
   
      <img
        src="/Property 1=BlackV1.svg"
        alt="Logo GoBook Light"
        className={`logoLigth ${state.theme === "dark" ? "hidden" : ""}`}
      />

      
      <img
        src="/GoBook_LOGO_LIGHT.svg"
        alt="Logo GoBook Dark"
        width={105}
        className={`logoDark ${state.theme === "" ? "hidden" : ""}`}
      />

    </div>
  );
};

export default LogoImg;