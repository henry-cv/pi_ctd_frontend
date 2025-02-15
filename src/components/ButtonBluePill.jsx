import '../css/BluePill.css';
import PropTypes from 'prop-types';

const ButtonBluePill = ({ text = "Button" }) => {
  return (
    <button
      className='button-blue'
    >
      {text}
    </button>
  )
}
ButtonBluePill.propTypes = {
  text: PropTypes.string.isRequired
};
export default ButtonBluePill