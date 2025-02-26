import '../css/components/BluePill.css';
import PropTypes from 'prop-types';

const ButtonBluePill = ({ text = "Button", className = "button-blue", size = "default" }) => {
  return (
    <button
      className={`button ${className} button-${size}`}
    >
      {text}
    </button>
  )
}

ButtonBluePill.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string
};

export default ButtonBluePill;