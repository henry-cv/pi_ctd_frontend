import '../css/BluePill.css';
import PropTypes from 'prop-types';

const BottonBluePill = ({ text = "Button" }) => {
  return (
    <button
      className='boton-blue'
    >
      {text}
    </button>
  )
}
BottonBluePill.propTypes = {
  text: PropTypes.string
};

export default BottonBluePill;