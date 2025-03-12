import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import logo from '/YellowHeart.png';

const ModalAviso = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const hasSeenModal = localStorage.getItem("hasSeenModal");

    if (isMobile && !hasSeenModal) {
      setTimeout(() => setVisible(true), 2000);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded-[18px] p-[63px_50px] w-[388px] h-[523px] shadow-md animate-fadeIn"
        style={{ position: "absolute", top: "164px", left: "25px" }}
      >
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-[197px] h-[65px] mx-auto mb-[27px]" />

        {/* Texto */}
        <p className="text-[#101828] font-[Outfit] text-[20px] font-normal leading-[25px] text-center w-[288px] h-[122px] mx-auto">
          Aquí puedes ver algunas estadísticas y datos relevantes. Para acceder a todas las funciones de administración, usa la versión de escritorio.
        </p>

        {/* Botón */}
        <button
          className="bg-[#3E10DA] text-white text-[20px] font-[Outfit] leading-[25px] rounded-[72px] w-[288px] h-[43px] mt-[27px] mx-auto flex items-center justify-center"
          onClick={() => {
            setVisible(false);
            onClose();
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

ModalAviso.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ModalAviso;
