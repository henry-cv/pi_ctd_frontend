import '../css/components/BluePill.css';
import PropTypes from 'prop-types';

const ButtonBluePill = ({ text = "Button", className = "button-blue", size = "default", disabled = false, onClick = () => {} }) => {
  return (
    <button
      className={`button ${className} button-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

ButtonBluePill.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool
};

export default ButtonBluePill;