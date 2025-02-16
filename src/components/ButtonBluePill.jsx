import '../css/BluePill.css';
import PropTypes from 'prop-types';

const ButtonBluePill = ({ text = "Button", className = "button-blue" }) => {
  return (
    <button
      className={`button ${className}`}
    >
      {text}
    </button>
  )
}

ButtonBluePill.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export default ButtonBluePill;