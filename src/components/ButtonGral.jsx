import { FaSearch } from "react-icons/fa"; // Ícono de ejemplo
import PropTypes from "prop-types";
import "../css/dashboard.css";

const ButtonGral = ({ text, color = "blue", icon = <FaSearch /> }) => {
  const baseStyles = color === "yellow" ? "btn_yellow" : "btn_blue ";

  return (
    <button className={`btn_style ${baseStyles}`}>
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

ButtonGral.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  icon: PropTypes.element,
};

export default ButtonGral;
