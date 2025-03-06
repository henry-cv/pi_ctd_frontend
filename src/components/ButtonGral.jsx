import PropTypes from "prop-types";
import "../css/pages/dashboard.css";

const ButtonGral = ({ text, color = "transparent", icon = null , onClick}) => {
  const colorStyles = {
    yellow: "btn_yellow",
    blue: "btn_blue",
    transparent: "btn_transparent",
  };

  const buttonClass = `btn_style ${
    colorStyles[color] || colorStyles.transparent
  }`;

  return (
    <button 
    className={buttonClass}
    onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

ButtonGral.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["yellow", "blue", "transparent"]),
  icon: PropTypes.element,
};

export default ButtonGral;
